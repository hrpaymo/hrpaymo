import React from 'react';
import axios from 'axios';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const style = {
  form: {
    display: 'block',
  },
  input: {
    background: '#f8f8f8',
  },
  button: {
    lable: {
      color: '#fff',
      position: 'relative'
    },
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    width: 30,
  }
}

class Payment extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      payeeUsername: '',
      amount: '',
      note: '',
      paymentFail: false
    }
  }

  handleInputChanges (event) {
    let target = event.target;
    this.setState({
      [target.name] : target.value
    })
  }

  payUser() {
    let payment = {
      payerId: this.props.payerId,
      payeeUsername: this.state.payeeUsername,
      amount: this.state.amount,
      note: this.state.note
    };
    axios.post('/pay', payment)
      .then((response) => {
        this.setState({
          payeeUsername: '',
          amount: '',
          note: '',
          paymentFail: false
        });
      })
      .catch(error => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              console.error('UNAUTHORIZED:', error.response);
              break;
            case 422:
              console.error('UNPROCESSABLE ENTRY:', error.response);
              break;
            case 400:
              console.error('BAD REQUEST:', error.response);
              break;
          }
        } else {
          console.error('Error in payment component:', error);
        }
        this.setState({
          paymentFail: true
        });
      })
  }

  render() {
    return (
      <Paper className='payment-container' style={style.form}>
        <div className='payment-item-container'>
          <label>
            <div className="form-box top left">
              <TextField
                hintText="Enter a username"
                floatingLabelText="Who do you want to pay?"
                style={style.input}
                name='payeeUsername'
                value={this.state.payeeUsername}
                onChange = {this.handleInputChanges.bind(this)}
              /><br />
            </div>
          </label>
          <label>
            <div className="form-box top right">
              <TextField
                style={style.input}
                name='amount'
                value={this.state.amount}
                onChange = {this.handleInputChanges.bind(this)}
                hintText="Enter an amount"
                floatingLabelText="How much to give away?"
              /><br />
            </div>
          </label>
          <label>
            <div className="form-box bottom">
              <TextField
                style={style.input}
                name='note'
                value={this.state.note}
                onChange = {this.handleInputChanges.bind(this)}
                hintText="Leave a comment"
                floatingLabelText="Got something to say?"
                fullWidth={true}
                multiLine={true}
              /><br />
            </div>
          </label>
        </div>

        <div className="pay-button-container"> 
          {this.state.paymentFail
            ? <label className='payment-fail'>
                Error in payment processing
              </label>
            : null
          }

          <div>
            <FlatButton 
              className='pay-button' 
              onClick={this.payUser.bind(this)} 
              label="Pay!" 
              primary={true} 
              style={style.button} 
              backgroundColor="#3D95CE"
              hoverColor='#03A9F4'
              labelStyle={style.button.lable}
            />
          </div>

        </div>

      </Paper>
    );
  }
}

  // render() {
  //   return (
  //     <Paper className='payment-container' style={style.form}>
  //       <div className='payment-item-container'>
  //         <label>
  //           To Pay:
  //           <div className="form-box top left">
  //           <input
  //             name='payeeUsername'
  //             value={this.state.payeeUsername}
  //             onChange = {this.handleInputChanges.bind(this)}
  //           />
  //           </div>
  //           <br />
  //         </label>
  //         <label>
  //           Amount:
  //           <div className="form-box top right">
  //           <input
  //             name='amount'
  //             value={this.state.amount}
  //             onChange = {this.handleInputChanges.bind(this)}
  //           />
  //           </div>
  //           <br />
  //         </label>
  //         <label>
  //           <div className="form-box">
  //           <input
  //               name='note'
  //               value={this.state.note}
  //               onChange = {this.handleInputChanges.bind(this)}
  //           />
  //           </div>
  //           <br />
  //         </label>
  //       </div>

  //       <div className="pay-button-container"> 
  //         {this.state.paymentFail
  //           ? <label className='payment-fail'>
  //               Error in payment processing
  //             </label>
  //           : null
  //         }
  //         <div>
  //           <FlatButton 
  //             className='pay-button' 
  //             onClick={this.payUser.bind(this)} 
  //             label="Pay!" 
  //             primary={true} 
  //             style={style.button} 
  //             backgroundColor="#3D95CE"
  //             hoverColor='#03A9F4'
  //             labelStyle={style.button.lable}
  //           />
  //         </div>
  //       </div>
  //     </Paper>
  //   );
  // }

export default Payment;