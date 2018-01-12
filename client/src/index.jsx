import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom'
import LoggedOutHome from './components/LoggedOutHome.jsx';
import Home from './components/Home.jsx';
import NavBar from './components/Navbar.jsx';
import axios from 'axios';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';

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
    // Feel free to rename.
    // Here we will load all additional user-specific data
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

  requireAuth(nextState, replace) {
    if (!this.state.isLoggedIn) {
      replace({
        pathname: '/login'
      })
    }
  }

  render () {
    const home = (props) => {
      return (
        <div>
          <NavBar 
            isLoggedIn={this.state.isLoggedIn}
            logUserOut={this.logUserOut.bind(this)} />
          {!this.state.isLoggedIn 
            ? <LoggedOutHome />
            : <Home 
                userFeed={this.state.userFeed} 
                globalFeed={this.state.globalFeed}
                {...props}
                />
          }
        </div>
      )
    }

    const LoginWithProps = (props) => {
      return (
        <Login 
          logUserIn={this.logUserIn.bind(this)}
          {...props}
        />
      );
    }

    const SignupWithProps = (props) => {
      return (
        <SignUp 
          logUserIn={this.logUserIn.bind(this)}
          {...props}
        />
      );
    }

    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route 
              exact path="/signup" 
              component={SignupWithProps} />
            <Route 
              exact path="/login" 
              component={LoginWithProps} />
            <Route 
              path="/view/:id" 
              component={home} 
              onEnter={ this.requireAuth }/>
            <Route 
              path="/" 
              component={home} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
