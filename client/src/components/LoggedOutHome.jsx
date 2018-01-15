import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';

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
          <span>Send money and make purchases with Paymo.</span>
          <br/>
          <span>New to Paymo?</span>
          <br/>
          <Link to="/signup"><button className='btn'>Create an account</button></Link>
          <br/>
          <span>Already a member?</span>
          <br/>
          <Link to="/login"><button className='btn'>Sign in</button></Link>
        </div>
      </div>
    );
  }
}

export default LoggedOutHome;