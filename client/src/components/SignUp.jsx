import React from 'react';
import axios from 'axios';

class SignUp extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      avatarUrl: '',
      didSignupFail: false,
      errorCode: null
    }
  }

  handleInputChanges (event) {
    let target = event.target;
    this.setState({
      [target.name]: target.value
    })
  }

  signUserUp() {
    let user = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone: this.state.phone,
      password: this.state.password,
      avatarUrl: this.state.avatarUrl
    };

    axios.post('/signup', user)
      .then((response) => {
        let userId = response.userId;
        this.props.logUserIn(userId);
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          console.log('error authenticating user errors', error.response)
          this.setState({
            didSignupFail: true,
            errorCode: 422
          })
        } else {
          console.log('Error in component', error.response)
          this.setState({
            didSignupFail: true,
            errorCode: 500
          })   
        }
      });
  }

  render() {
    return (
      <div className='signup form'>
        <label>
          Username
          <input 
            name='username'
            onChange = {this.handleInputChanges.bind(this)}
            />
        </label>
        <label>
          First Name
          <input 
            name='firstName'
            onChange = {this.handleInputChanges.bind(this)}
            />
        </label>
        <label>
          Last Name
          <input 
            name='lastName'
            onChange = {this.handleInputChanges.bind(this)}
            />
        </label>
        <label>
          Email
          <input 
            name='email'
            onChange = {this.handleInputChanges.bind(this)}
            />
        </label>
        <label>
          Phone
          <input 
            name='phone'
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
        <label>
          Avatar Url
          <input 
            name='avatarUrl'
            onChange = {this.handleInputChanges.bind(this)}
            />
        </label>
        {this.state.didSignupFail && 
          <span className="error-text">
            {this.state.errorCode === 422
              ? <span>Username, Phone Number, or Email is not unique. Please try again.</span>
              : <span>Our servers are having issues. Please try later</span>
            }
          </span>
        }
        <button onClick={this.signUserUp.bind(this)} >Sign up</button>
      </div>
    );
  }
}

export default SignUp;