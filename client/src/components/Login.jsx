import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      didLoginFail: false,
      errorCode: null
    }
  }

  handleInputChanges (event) {
    let target = event.target;
    this.setState({
      [target.name]: target.value
    })
  }

  logUserIn() {
    let user = {
      'username': this.state.username,
      'password': this.state.password
    }

    axios.post('/login', user)
      .then((response) => {
        let userId = 2;
        this.props.logUserIn(userId);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log('error authenticating user errors', error);
          this.setState({
            didLoginFail: true,
            errorCode: 401
          })
        } else {
          console.log('Error in login component:', error)
          this.setState({
            didLoginFail: true,
            errorCode: 500
          })   
        }
      });
  }

  render() {
    return (
      <div>
        <label>
          Username
          <input 
            name='username'
            onChange = {this.handleInputChanges.bind(this)}
            />
        </label>
        <label>
          Password
          <input 
            name='password'
            onChange = {this.handleInputChanges.bind(this)}
            />
        </label>
        {this.state.didLoginFail && 
          <span className="error-text">
            {this.state.errorCode === 401
              ? <span>Username or Password incorrect. Please try again</span>
              : <span>Our servers are having issues! Please try later</span>
            }
          </span>
        }
        <button onClick={this.logUserIn.bind(this)} >Log in</button>
      </div>
    );
  }
}

export default Login;