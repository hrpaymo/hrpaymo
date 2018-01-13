import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from '../components/Navbar.jsx';

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
        let userId = response.data.userId;
        this.props.logUserIn(userId);
        this.props.history.push('/');
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log('error authenticating user errors', error.response);
          this.setState({
            didLoginFail: true,
            errorCode: 401,
            errorMessage: error.response.data.error
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
        <NavBar isLoggedIn={false} />
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
              ? <span>{this.state.errorMessage}</span>
              : <span>Our servers are having issues. Please try later</span>
            }
          </span>
        }
        <button onClick={this.logUserIn.bind(this)} >Log in</button>
        <Link to="/signup">... or create an account</Link>
      </div>
    );
  }
}

export default Login;