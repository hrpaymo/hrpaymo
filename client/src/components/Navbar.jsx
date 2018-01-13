import React from 'react';
import { withRouter, Link } from "react-router-dom";
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

  logOutAndRedirect () {
    this.props.logUserOut();
    this.props.history.push("/login");
  }

  render() {
    return (
      <AppBar 
        className='navbar'
        style={style.nav}
        title={
          <div className='navbar-logo'>
            <Link to="/"><h1>Hello Paymo</h1></Link>
          </div>
        }
        iconElementRight={
          <div className='navbar-menu'>
            {this.props.isLoggedIn && 
              <FlatButton 
                className='navbar-logout' 
                onClick={this.logOutAndRedirect.bind(this)} 
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

export default withRouter(Navbar);