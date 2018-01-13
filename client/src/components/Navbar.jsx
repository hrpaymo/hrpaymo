import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const style = {
  nav: {
    background: '#3D95CE',
  },
  left: {
    display: 'none',
  },
  log_out: {
    color: '#fff',
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
            Hello Paymo
          </div>
        }
        iconStyleLeft={style.left}
        iconElementRight={
          <div>
            {this.props.isLoggedIn && 
              <FlatButton 
                style={style.log_out}
                hoverColor='#03A9F4'
                className='navbar-logout' 
                onClick={this.props.logUserOut} 
                label="Log Out" 
              />
            }
          </div>
        }
      />

    );
  }
}

export default Navbar;