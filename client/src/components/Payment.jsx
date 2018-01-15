import React from 'react';
import axios from 'axios';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';

const style = {
  form: {
    display: 'block',
  },
  input: {
    background: '#f8f8f8',
  },
  button: {
    label: {
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

  onDropdownInput(searchText) {
    this.setState({
      payeeUsername: searchText
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
        this.props.refreshUserData(this.props.payerId);
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
          <div className="form-box top left">
            <AutoComplete
              hintText="Enter a username"
              floatingLabelText="Who do you want to pay?"
              style={style.input}
              name='payeeUsername'
              filter={AutoComplete.caseInsensitiveFilter}
              dataSource={this.props.usernames}
              maxSearchResults={7}
              searchText={this.state.payeeUsername}
              onUpdateInput = {this.onDropdownInput.bind(this)}
            />
            <br />
          </div>
          <div className="form-box top right">
            <TextField
              style={style.input}
              name='amount'
              value={this.state.amount}
              onChange = {this.handleInputChanges.bind(this)}
              hintText="Enter an amount"
              floatingLabelText="How much to give away?"
            />
            <br />
          </div>
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
            />
            <br />
          </div>
        </div>

        <div className="pay-button-container"> 
          <button className='btn' onClick={this.payUser.bind(this)}>Pay</button>
          {this.state.paymentFail
            ? <label className='error-text'>
                Error in payment processing
              </label>
            : null
          }
        </div>
      </Paper>
    );
  }
}

export default Payment;