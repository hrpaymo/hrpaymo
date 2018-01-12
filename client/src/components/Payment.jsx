import React from 'react';
import axios from 'axios';

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
        console.log('new balance for user', this.props.payerId, ':', response.data.balance);
        let balance = response.data.balance;
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
      <div className='payment_component'>
        <label>
          Recipient Username
          <input
            name='payeeUsername'
            value={this.state.payeeUsername}
            onChange = {this.handleInputChanges.bind(this)}
          />
        </label>
        <label>
          Payment Amount
          <input
            type="text"
            // pattern="^[0-9]*\.[0-9]{0,2}$"
            name='amount'
            value={this.state.amount}
            onChange = {this.handleInputChanges.bind(this)}
          />
        </label>
        <label>
          Note
          <input
            name='note'
            value={this.state.note}
            onChange = {this.handleInputChanges.bind(this)}
          />
        </label>
        <button className='pay_button' onClick={this.payUser.bind(this)}>Pay!</button>
        {this.state.paymentFail
          ? <label className='payment_fail'>
              Error in payment processing
            </label>
          : null
        }
      </div>
    );
  }
}

export default Payment;