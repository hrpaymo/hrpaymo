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
<<<<<<< HEAD
      userFeed: {}
=======
      balance: 0
>>>>>>> Create balance sub component
    }
  }

  componentDidMount() {
  }

  loadUserData(userId) {
<<<<<<< HEAD
=======
    // Feel free to rename.
    // Here we will load all additional user-specific data
    this.getBalance(userId);
>>>>>>> Create balance sub component
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
<<<<<<< HEAD
              userFeed={this.state.userFeed}
              globalFeed={this.state.globalFeed}/> 
=======
              globalFeed={this.state.globalFeed}
              balance={this.state.balance}
              /> 
>>>>>>> Create balance sub component
        }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
