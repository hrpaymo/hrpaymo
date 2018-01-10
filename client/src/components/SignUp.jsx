import React from 'react';

class SignUp extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: ''
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
      password: this.state.password
    };

    this.props.signUserUp(user);
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
        <button onClick={this.signUserUp.bind(this)} >Sign up</button>
      </div>
    );
  }
}

export default SignUp;