import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

class LoggedOutHome extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar 
          isLoggedIn={this.props.isLoggedIn} 
          logUserOut={this.props.logUserOut} />
        <div className='splash'>
          Send money and make purchases with Paymo.
          <Link to="/signup"><button>Create an Account</button></Link>
          <Link to="/login">Or sign in to your account here</Link>
        </div>
      </div>
    );
  }
}

export default LoggedOutHome;