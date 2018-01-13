// ---------- Packages ---------- //
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import $ from 'jquery';
import axios from 'axios';

// ---------- Material UI ---------- //
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// ---------- Componenets ---------- //
import LoggedOutHome from './components/LoggedOutHome.jsx';
import Home from './components/Home.jsx';
import NavBar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoggedIn: false,
      globalFeed: {},
      userFeed: {},
      balance: null,
      userInfo: {}
    }
  }

  componentDidMount() {
  }

  loadUserData(userId) {
    this.getUserInfo(userId)
    this.getBalance(userId);
    this.getGlobalFeed();
    this.getUserFeed(userId);
  }


  refreshUserData(userId) {
    this.getBalance(userId);
    this.getGlobalFeed(this.state.globalFeed.newestTransactionId || null);
    this.getUserFeed(userId, this.state.userFeed.newestTransactionId || null);
  }

  getUserFeed(userId, sinceId = null) {
    let additionalData = {params: {sinceId: sinceId}}

    axios(`/feed/user/${userId}`, additionalData)
      .then((response) => {
        this.prependNewTransactions('mine', response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getGlobalFeed(sinceId = null) {
    let additionalData = {params: {sinceId: sinceId}}

    axios('/feed/global', additionalData)
      .then((response) => {
        this.prependNewTransactions('public', response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  prependNewTransactions(feedType, transactionSummary) {
    if (!transactionSummary || transactionSummary.count === 0) {
      return;
    }

    let stateRef = (feedType === 'public') ? 'globalFeed' : 'userFeed';

    // If there is no existing data in the feed, set the transaction summary
    if (!this.state[stateRef].count || this.state[stateRef].count === 0) {
        this.setState({
          [stateRef]: transactionSummary
        });  
    } else {
      // If there is already existing data in the feed, combine them to prepend the new 
      // transactions to the top
      let combinedItems = transactionSummary.items.concat(this.state[stateRef].items);

      // Might be a better design to make a deep copy of state and then 
      // manipulate. See the module "immutability-helper"

      let newFeedState = {
        items: combinedItems,
        count: (this.state[stateRef].count || 0) + transactionSummary.count,
        nextPageTransactionId: this.state[stateRef].nextPageTransactionId,
        newestTransactionId: transactionSummary.newestTransactionId
      }

      this.setState({
        [stateRef]: newFeedState
      })
    }
  }

  loadMoreFeed(feedType, userId) {
    let endpoint;
    let stateRef;

    if (feedType === 'public') {
      endpoint = '/feed/global';
      stateRef = 'globalFeed';
    } else if (feedType == 'mine') {
      endpoint = `/feed/user/${userId}`;
      stateRef = 'userFeed';
    } else {
      return;
    }

    let additionalData = {params: {beforeId: this.state[stateRef].nextPageTransactionId}}

    axios(endpoint, additionalData)
      .then((response) => {
        // Confirm additional items to load
        if (response.data && response.data.count > 0) {

          let combinedItems = this.state[stateRef].items.concat(response.data.items);

          // Might be a better design to make a deep copy of state and then 
          // manipulate. See the module "immutability-helper"

          let newFeedState = {
            items: combinedItems,
            count: this.state[stateRef].count + response.data.count,
            nextPageTransactionId: response.data.nextPageTransactionId,
            newestTransactionId: this.state[stateRef].newestTransactionId
          }

          this.setState({
            [stateRef]: newFeedState
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
                {...props}
                />
          }
        </div>
      )
    }

    return (

      <MuiThemeProvider>
        <div>
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
                onEnter={ this.requireAuth }/>
              <Route 
                path="/" 
                render={HomeWithProps} />
            </Switch>
          </BrowserRouter>
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
