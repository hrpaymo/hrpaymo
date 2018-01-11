import React from 'react';
import { withRouter, Link } from "react-router-dom";

class Navbar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoggedIn: this.props.isLoggedIn
    }
  }

  logOutAndRedirect () {
    this.props.logUserOut();
    this.props.history.push("/login");
  }

  render() {
    return (
      <div className='navbar'>
        <div className='navbar-logo'>
          <Link to="/"><h1>Hello Paymo</h1></Link>
        </div>
        <div className='navbar-menu'>
          {this.props.isLoggedIn && 
            <div className='navbar-logout' onClick={this.logOutAndRedirect.bind(this)}> Log Out</div>
          }
        </div>
      </div>

    );
  }
}

export default withRouter(Navbar);