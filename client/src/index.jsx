// ---------- Packages ---------- //
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import $ from 'jquery';
import axios from 'axios';

// ---------- Material UI ---------- //
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// ---------- Componenets ---------- //
import LoggedOutHome from './components/LoggedOutHome.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import Profile from './components/Profile.jsx';
import Navbar from './components/Navbar.jsx';



const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#3D95CE',
  },
});

const FEED_ENDPOINTS = {
  'globalFeed': '/feed/global',
  'userFeed': '/feed/user'
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoggedIn: false,
      globalFeed: {},
      userFeed: {},
      balance: null,
      userInfo: {},
      usernames: []
    }
  }

  componentDidMount() {
  }

  loadUserData(userId) {
    this.getUserInfo(userId)
    this.getBalance(userId);
    this.getGlobalFeed();
    this.getUserFeed(userId);
    this.getUsernames(userId);
  }

  refreshUserData(userId) {
    this.getBalance(userId);
    this.getGlobalFeed(this.state.globalFeed.newestTransactionId || null);
    this.getUserFeed(userId, this.state.userFeed.newestTransactionId || null);
    this.getUsernames(userId)
  }

  getUsernames(userId) {
    axios('/usernames', { params: { userId: userId }})
    .then(response => {
      this.setState({
        usernames: response.data.usernames
      });
    })
    .catch(err => {
      console.error(err);
    })
  }

  getUserFeed(userId, sinceId = null) {
    let feedType = 'userFeed';
    let endpoint = FEED_ENDPOINTS[feedType];
    endpoint = `${endpoint}/${userId}`

    let params = {
      sinceId: sinceId
    }

    axios(endpoint, {params: params})
      .then((response) => {
        this.prependNewTransactions(feedType, response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getGlobalFeed(sinceId = null) {
    let feedType = 'globalFeed';
    let endpoint = FEED_ENDPOINTS[feedType];

    let params = {
      sinceId: sinceId
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
    if (!transactionSummary || transactionSummary.count === 0) {
      return;
    }

    // If feed was empty, set the returned transactions as the feed
    if (!this.state[feedType].count || this.state[feedType].count === 0) {
      this.setState({
        [feedType]: transactionSummary
      });  
    } else {
      // If there is already existing data in the feed, combine them, prepending the 
      // more recent transactions to the top
      let combinedItems = transactionSummary.items.concat(this.state[feedType].items);

      // Update feed meta-data to accurately reflect combined data
      let newFeedState = {
        items: combinedItems,
        count: (this.state[feedType].count || 0) + transactionSummary.count,
        nextPageTransactionId: this.state[feedType].nextPageTransactionId,
        newestTransactionId: transactionSummary.newestTransactionId
      }

      // Set state
      this.setState({
        [feedType]: newFeedState
      })
    }
  }

  loadMoreFeed(feedType, userId) {
    let endpoint = FEED_ENDPOINTS[feedType];

    if (feedType === 'userFeed') {
      endpoint = `${endpoint}/${userId}`;
    } 

    // Send along the next valid ID you'd like returned back
    // from the database
    let params = {
      beforeId: this.state[feedType].nextPageTransactionId
    }

    axios(endpoint, {params: params})
      .then((response) => {

        // Confirm there additional items to load
        if (response.data && response.data.count > 0) {

          // combine the items, appending the 
          // returned transactions to the bottom
          let combinedItems = this.state[feedType].items.concat(response.data.items);

          let newFeedState = {
            items: combinedItems,
            count: this.state[feedType].count + response.data.count,
            nextPageTransactionId: response.data.nextPageTransactionId,
            newestTransactionId: this.state[feedType].newestTransactionId
          }

          this.setState({
            [feedType]: newFeedState
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

  logUserIn(userId) {
    this.setState({
      isLoggedIn: true
    })
    this.loadUserData(userId);
  }

  logUserOut() {
    this.setState({
      isLoggedIn: false,
      globalFeed: {},
      userFeed: {},
      balance: null,
      userInfo: {}
    })
  }

  requireAuth(nextState, replace) {
    if (!this.state.isLoggedIn) {
      replace({
        pathname: '/login'
      })
    }
  }

  render () {
    const HomeWithProps = (props) => {
      return (
        <div>
          {!this.state.isLoggedIn 
            ? <LoggedOutHome 
                isLoggedIn={this.state.isLoggedIn} 
                logUserOut={this.logUserOut.bind(this)}
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
                usernames={this.state.usernames}
                {...props}
              />
          }
        </div>
      )
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <BrowserRouter>
          <Switch>
            <Route 
              exact path="/signup" 
              render={routeProps => <SignUp {...routeProps} logUserIn={this.logUserIn.bind(this)} />} 
            />
            <Route 
              exact path="/login" 
              render={routeProps => <Login {...routeProps} logUserIn={this.logUserIn.bind(this)} />} 
            />
            <Route 
              path="/view?=(:id)" 
              render={HomeWithProps}
              onEnter={ this.requireAuth }
            />
            <Route 
              path="/:username" 
              render={routeProps => 
                <Profile {...routeProps} 
                  refreshUserData={this.refreshUserData.bind(this)}
                  isLoggedIn={this.state.isLoggedIn} 
                  logUserOut={this.logUserOut.bind(this)}
                  userInfo={this.state.userInfo} />
              } />
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

ReactDOM.render(<App />, document.getElementById('app'));
