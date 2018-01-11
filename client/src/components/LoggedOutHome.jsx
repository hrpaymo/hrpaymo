import React from 'react';
import { Link } from 'react-router-dom';

class LoggedOutHome extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to="/login"><button>Login Here</button></Link>
        <Link to="/signup"><button>Sign-up Here</button></Link>
      </div>
    );
  }
}

export default LoggedOutHome;