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
      auth: false
    }
  }

  componentDidMount() {
  }

  render () {
    return (
      <div>
        <h1>Hello Paymo</h1>
        {!this.state.auth 
          ? <LoggedOutHome/>
          : <Home/>}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
