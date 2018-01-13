import React from 'react';
import axios from 'axios';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  background: '#f8f8f8'
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
      <Paper className='payment-component feed-container'>
        <label>
          <div className="form-box">
            <TextField
              style={style}
              name='payeeUsername'
              value={this.state.payeeUsername}
              onChange = {this.handleInputChanges.bind(this)}
              hintText="Enter a username"
              floatingLabelText="Who do you want to pay?"
            />
          </div>
          <br />
        </label>
        <label>
          <div className="form-box">
            <TextField
              style={style}
              name='amount'
              value={this.state.amount}
              onChange = {this.handleInputChanges.bind(this)}
              hintText="Enter an amount to pay"
              floatingLabelText="How much to give away?"
            />
          </div>
          <br />
        </label>
        <label>
          <div className="form-box">
            <TextField
              style={style}
              name='note'
              value={this.state.note}
              onChange = {this.handleInputChanges.bind(this)}
              hintText="Leave a comment"
              floatingLabelText="Got something to say?"
            />
          </div>
          <br />
        </label>
        <div className="pay-button-container">
          <RaisedButton 
            className='pay-button' 
            onClick={this.payUser.bind(this)} 
            label="Pay!" 
            primary={true} 
            style={style} 
          />
        </div>
        {this.state.paymentFail
          ? <label className='payment-fail'>
              Error in payment processing
            </label>
          : null
        }
      </Paper>
    );
  }
}

export default Payment;