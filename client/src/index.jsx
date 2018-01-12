import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import LoggedOutHome from './components/LoggedOutHome.jsx';
import Home from './components/Home.jsx';
import NavBar from './components/Navbar.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoggedIn: false,
      globalFeed: {},
      userFeed: {},
      balance: 0,
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

  getUserFeed(userId) {
    axios(`/feed/user/${userId}`)
      .then((response) => {
        this.setState({
          userFeed: response.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getGlobalFeed() {
    axios('/feed/global')
      .then((response) => {
        this.setState({
          globalFeed: response.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
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

    let additionalData = {params: {startingTransactionId: this.state[stateRef].nextPageTransactionId}}

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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
      isLoggedIn: false
    })
  }

  render () {
    return (
      <div>
        <NavBar 
          isLoggedIn={this.state.isLoggedIn}
          logUserOut={this.logUserOut.bind(this)}/>
        {!this.state.isLoggedIn 
          ? <LoggedOutHome 
              logUserIn={this.logUserIn.bind(this)}/>
          : <Home
              userFeed={this.state.userFeed}
              globalFeed={this.state.globalFeed}
              loadMoreFeed={this.loadMoreFeed.bind(this)}
              balance={this.state.balance}
              userInfo={this.state.userInfo}
              /> 
        }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
