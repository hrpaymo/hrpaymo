import React from 'react';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';

class LoggedOutHome extends React.Component {
  constructor (props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <button>Log in here </button>
        <button>Sign up here </button>
      </div>
    );
  }
}

export default LoggedOutHome;