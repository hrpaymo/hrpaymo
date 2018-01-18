// ---------- Packages ---------- //
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import $ from 'jquery';
import axios from 'axios';

// ---------- React-Redux ---------- //
import { connect } from 'react-redux';

// ---------- Material UI ---------- //
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// ---------- Componenents ---------- //
import LoggedOutHome from './components/LoggedOutHome.jsx';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import Navbar from './components/Navbar.jsx';
// ---------- Helper ---------- //
import feedManipulation from './feedManipulation.js'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#3D95CE',
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoggedIn: false,
      globalFeed: {},
      userFeed: {},
      balance: null,
      userInfo: {},
      friends: []
    }
  }

  componentWillMount() {
    this.client_id = '636654108787-tpfoiuolsol40okb92hejj1f3912dc7l.apps.googleusercontent.com';
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      // Check if the user already has an active session
      gapi.auth2.init({ client_id: this.client_id })
        .then(googleAuth => {
          if (googleAuth.isSignedIn.get()) {
            let idToken = googleAuth.currentUser.get().getAuthResponse().id_token;
              axios.post('/login', {idToken})
                .then((userId) => {
                  console.log('userid', userId)
                  this.logUserIn(userId.data);
                })
                .catch((err) => {
                  alert('Login failed!');
                  console.log('login error', err);
                })
            }


          })
        });
      // if user is not logged in
  }

  loadUserData(userId) {
    this.getUserInfo(userId);
    this.getBalance(userId);
    this.getFeed('globalFeed', userId);
    this.getFeed('userFeed', userId);
    this.getFriendsList(userId);
  }

  refreshUserData(userId) {
    this.getBalance(userId);
    this.getFeed('globalFeed', userId, this.state.globalFeed.newestTransactionId || null);
    this.getFeed('userFeed', userId, this.state.userFeed.newestTransactionId || null);
    this.getFriendsList(userId);
  }

  getFeed(feedType, userId = null, sinceId) {
    let endpoint = feedManipulation.returnFeedEndpoint(feedType, userId);

    let params = {
      sinceId: sinceId,
      userId: userId
    }

    axios(endpoint, {params: params})
      .then((response) => {
        this.prependNewTransactions(feedType, response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  prependNewTransactions(feedType, transactionSummary) {
    // If no results return, do nothing
    if (!transactionSummary || transactionSummary.count === 0) {
      return;
    }

    // If feed was empty, set the returned transactions as the feed
    let isFeedEmpty = !this.state[feedType].count || this.state[feedType].count === 0;

    let newFeedObject = isFeedEmpty
      ? transactionSummary
      : feedManipulation.mergeFeeds(transactionSummary, this.state[feedType]);

    this.setState({
      [feedType]: newFeedObject
    })
  }

  loadMoreFeed(feedType, userId) {
    let endpoint = feedManipulation.returnFeedEndpoint(feedType, userId);

    // Send along the next valid ID you'd like returned back
    // from the database
    let params = {
      beforeId: this.state[feedType].nextPageTransactionId
    }

    axios(endpoint, {params: params})
      .then((response) => {

        // Confirm there additional items to load
        if (response.data && response.data.count > 0) {
          let combinedItems = feedManipulation.mergeFeeds(this.state[feedType], response.data);

          this.setState({
            [feedType]: combinedItems
          })
        }
      })
      .catch((err) => {
        console.error(err);
      }); 
  }

  getBalance(userId) {
    axios('/balance', {params: {userId: userId}})
      .then((response) => {
        this.setState({
          balance: response.data.amount
        });
      })
      .catch((err) =>{
        console.error(err);
      });
  }

  getUserInfo(userId) {
    axios('/profile', {params: {userId: userId}})
      .then((response) => {
        this.setState({
          userInfo: response.data
        });
      })
      .catch((err) =>{
        console.error(err);
      });
  }

  getFriendsList(userId) {
    axios('/friends', {params: {userId: userId}})
      .then((response) => {
        this.setState({
          friends: response.data.friends
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  logUserIn(userId) {
    // set the userId in the userInfo object as soon as the user logs in
    var obj = this.state.userInfo;
    obj.userId = userId;
    this.setState({
      isLoggedIn: true,
      userInfo: obj
    })
    this.loadUserData(userId);
  }

  logUserOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('User signed out.');
      this.setState({
        isLoggedIn: false,
        globalFeed: {},
        userFeed: {},
        balance: null,
        userInfo: {}
      })
    });
  }

  render () {
    const HomeWithProps = (props) => {
      return (
        <div>
          {!this.state.isLoggedIn 
            ? <LoggedOutHome 
                isLoggedIn={this.state.isLoggedIn} 
                logUserIn={this.logUserIn.bind(this)}
                {...props}
              />
            : <Home
                refreshUserData={this.refreshUserData.bind(this)}
                isLoggedIn={this.state.isLoggedIn} 
                logUserOut={this.logUserOut.bind(this)}
                userFeed={this.state.userFeed} 
                loadMoreFeed={this.loadMoreFeed.bind(this)}
                globalFeed={this.state.globalFeed}
                userInfo={this.state.userInfo}
                balance={this.state.balance}
                friends={this.state.friends}
                {...props}
              />
          }
        </div>
      );
    };

    const ProfileWithProps = (routeProps) => {
      return (
        <div>
          {!this.state.isLoggedIn 
            ? <LoggedOutHome 
                isLoggedIn={this.state.isLoggedIn} 
                logUserIn={this.logUserIn.bind(this)}
                {...routeProps}
              />
            : <Profile 
                key={routeProps.location.pathname}
                refreshUserData={this.refreshUserData.bind(this)}
                isLoggedIn={this.state.isLoggedIn} 
                logUserOut={this.logUserOut.bind(this)}
                userInfo={this.state.userInfo}
                {...routeProps}
              />
          }
        </div>
      );
    };

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <BrowserRouter>
          <Switch>
            <Route 
              path="/:username"
              onEnter={ this.requireAuth }
              render={ProfileWithProps}
            />
            <Route 
              path="/" 
              render={HomeWithProps} 
            />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    )
  }
}


// ReactDOM.render(<App />, document.getElementById('app'));


function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps)(App);
