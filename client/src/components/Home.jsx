import React from 'react';
import Navbar from './Navbar.jsx';
import Payment from './Payment.jsx';
import FeedContainer from './FeedContainer.jsx';
import MiniProfile from './MiniProfile.jsx';

class Home extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MiniProfile balance={this.props.balance} userInfo={this.props.userInfo}/>
        <FeedContainer 
          userFeed={this.props.userFeed && this.props.userFeed.items}
          globalFeed={this.props.globalFeed && this.props.globalFeed.items} />
        <Payment payerId={this.props.userInfo.userId} />
      </div>
    );
  }
}

export default Home;