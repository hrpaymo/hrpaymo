import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const style = {
  nav: {
    background: '#3D95CE',
  },
  left: {
    display: 'none',

  }
};

class Navbar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoggedIn: this.props.isLoggedIn
    }
  }

  render() {
    return (
      <AppBar 
        className='navbar'
        style={style.nav}
        title={
          <div className='navbar-logo'>
            <h1>Hello Paymo</h1>
          </div>
        }
        iconElementRight={
          <div className='navbar-menu'>
            {this.props.isLoggedIn && 
              <FlatButton 
                className='navbar-logout' 
                onClick={this.props.logUserOut} 
                label="Log Out" 
                iconStyleLeft={style.left}
              />
            }
          </div>
        }
      />

    );
  }
}

export default Navbar;