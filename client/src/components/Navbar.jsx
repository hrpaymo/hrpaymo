import React from 'react';

class Navbar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoggedIn: this.props.isLoggedIn
    }
  }

  render() {
    return (
      <div className='navbar'>
        <div className='navbar-logo'>
          <h1>Hello Paymo</h1>
        </div>
        <div className='navbar-menu'>
          {this.props.isLoggedIn && 
            <div className='navbar-logout' onClick={this.props.logUserOut}> Log Out</div>
          }
        </div>
      </div>

    );
  }
}

export default Navbar;