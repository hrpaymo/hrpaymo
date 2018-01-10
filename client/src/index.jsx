import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import LoggedOutHome from './components/LoggedOutHome.jsx';
import Home from './components/Home.jsx';
// import <Component Name> from './components/<component>.jsx';
// import <Component Name> from './components/<component>.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoggedIn: false,
      userId: undefined
    }
  }

  componentDidMount() {
  }

  logUserIn(user) {
    // user is currently in form: 
    // {username: 'ginger', password: 'test'}
    
    // Add GET request here once endpoint is defined

    // After successful Login
    this.setState({
      userId: 2,
      isLoggedIn: true
    })
  }

  logUserOut() {
    this.setState({
      isLoggedIn: false
    })
  }

  signUserUp(user){
    // console.log('user to sign up:', user)
    // Add POST request here once endpoint is defined

    // After successful Post request
    this.setState({
      userId: 4,
      isLoggedIn: true
    })

  }

  render () {
    return (
      <div>
        <h1>Hello Paymo</h1>
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
