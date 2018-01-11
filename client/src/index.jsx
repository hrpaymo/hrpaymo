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
      globalFeed: {}
    }
  }

  componentDidMount() {
  }

  loadUserData(userId) {
    // Feel free to rename.
    // Here we will load all additional user-specific data for the 
    // logged-in user homepage

    this.getGlobalFeed();
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
              globalFeed={this.state.globalFeed}/> 
        }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
