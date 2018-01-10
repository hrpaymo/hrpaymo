import React from 'react';

class Login extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      password: ''
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
    this.props.logUserIn(user);
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
        <button onClick={this.logUserIn.bind(this)} >Log in</button>
      </div>
    );
  }
}

export default Login;