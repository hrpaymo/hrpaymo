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
      isLoggedIn: false
    }
  }

  componentDidMount() {
  }

  loadUserData(userId) {
    // Feel free to rename.
    // Here we will load all additional user-specific data for the 
    // logged-in user homepage
    console.log('user data loaded for user: ', userId);
  }

  logUserIn(user) {
    let request = axios.post('/login', user);

    // Return Axios request as a promise so that the log-in component can handle 
    // appropriate user-facing error responses
    return request
      .then(response => {
        let userId = response.userId;
        this.setState({
          isLoggedIn: true
        })
        this.loadUserData(userId);
        return response;
        })
      .catch(error => {
        return Promise.reject(error)
      });
  }

  logUserOut() {
    this.setState({
      isLoggedIn: false
    })
  }

  signUserUp(user){
    let request = axios.post('/signup', user);
    
    // Return Axios request as a promise so that the log-in component can handle 
    // appropriate user-facing error responses
    return request
      .then(response => {
        let userId = response.userId;
        this.setState({
          isLoggedIn: true
        })
        this.loadUserData(userId);
        return response;
        })
      .catch(error => {
        return Promise.reject(error)
      });
  }

  render () {
    return (
      <div>
        <NavBar isLoggedIn={this.state.isLoggedIn} logUserOut={this.logUserOut.bind(this)}/>
        {!this.state.isLoggedIn 
          ? <LoggedOutHome 
              signUserUp={this.signUserUp.bind(this)}
              logUserIn={this.logUserIn.bind(this)}/>
          : <Home/>}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
