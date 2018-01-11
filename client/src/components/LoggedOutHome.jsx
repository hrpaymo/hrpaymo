import React from 'react';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';

class LoggedOutHome extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      view: null
    }
  }

  changeViews(selectedView) {
    this.setState({
      view: selectedView
    })
  }

  render() {
    return (
      <div>
      {this.state.view === 'signup' && <SignUp logUserIn={this.props.logUserIn} />}
      {this.state.view === 'login' && <Login logUserIn={this.props.logUserIn}/>}
      {this.state.view === null && 
        <div>
          <button onClick={this.changeViews.bind(this, 'login')}>Log in here </button>
          <button onClick={this.changeViews.bind(this, 'signup')}>Sign up here </button>
          </div>}
        </div>
    );
  }
}

export default LoggedOutHome;