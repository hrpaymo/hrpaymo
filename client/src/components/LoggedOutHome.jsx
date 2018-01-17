import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import axios from 'axios';

class LoggedOutHome extends React.Component {
  constructor (props) {
    super(props);

  }

  componentDidMount() {
    this.client_id = '636654108787-tpfoiuolsol40okb92hejj1f3912dc7l.apps.googleusercontent.com';
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({ client_id: this.client_id })
        .then(result => {
          if (result.isSignedIn.get()) {
            let currentUserId = result.currentUser.get().getId();
            console.log('logged in', currentUserId);
          } else {
            console.log('false', result);
            result.attachClickHandler(this.refs.googleButton, {}, (googleUser) => {
              let id_token = googleUser.getAuthResponse().id_token;
              axios.post('/login', id_token);
              // send token to backend
              // backend sends the below axios get, checks if user is in db, then sends user data back. 
              axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + id_token)
                .then(response => {
                  // verifies validity of the token first
                  if (response.data.aud === this.client_id && (response.data.iss === 'accounts.google.com' || response.data.iss === 'https://accounts.google.com')) {
                    console.log(response.data)
                    // add to database
                    //.then
                    // set state to logged in
                  }
                })
            }, (error) => {
              alert('Login Failed');
            });
          }
        });
      // if user is not logged in
    });
  }

  signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
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
              <p>Already a member?</p>

              <div ref="googleButton" className="g-signin2"></div>
              <a href="#" onClick={this.signOut.bind(this)}>Sign out</a>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoggedOutHome;