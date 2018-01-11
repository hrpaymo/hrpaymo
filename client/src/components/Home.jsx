import React from 'react';
import Navbar from './Navbar.jsx';
import Payment from './Payment.jsx';
import Feed from './Feed.jsx';
import MiniProfile from './MiniProfile.jsx';

class Home extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <Payment/>
        </div>
        <div>
          <Feed/>
        </div>
        <div>
          <MiniProfile/>
        </div>
      </div>
    );
  }
}

export default Home;