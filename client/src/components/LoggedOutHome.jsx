import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import axios from 'axios';

class LoggedOutHome extends React.Component {
  constructor (props) {
    super(props);
    this.initializeLoginButton = this.initializeLoginButton.bind(this);
  }

  componentDidMount() {
    this.initializeLoginButton();
  }

  initializeLoginButton() {
    gapi.load('auth2', () => {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.attachClickHandler(this.refs.googleButton, {}, (googleUser) => {
        let idToken = googleUser.getAuthResponse().id_token;
        axios.post('/login', { idToken })
          .then((userId) => {
            // console.log('userid', userId)
            this.props.logUserIn(userId.data);
          })
          .catch((err) => {
            alert('Login failed!');
            console.log('login error', err);
          })
      }, (error) => {
        alert('Login Failed');
      });
    });
  }

  render() {
    return (
      <div>
        <Navbar 
          isLoggedIn={this.props.isLoggedIn} 
          logUserOut={this.props.logUserOut} />
        <div className='body-container'>
          <div className='splash' >
            <div className='splash-images'>
              <img src='/images/nexus-image.png' width='316px' height='643px' />
            </div>
            <div className='splash-textColumn'>
              <h1>Send money and make purchases with Paywaal.</h1>
              <p>Ready to get started?</p>

              <div ref="googleButton" className="g-signin2" data-width="350em" data-height="50em" data-longtitle="true"></div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoggedOutHome;