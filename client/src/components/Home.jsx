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
        <Payment/>
        <MiniProfile/>
        <Feed globalFeed={this.props.globalFeed && this.props.globalFeed.items}/>
      </div>
    );
  }
}

export default Home;