import React from 'react';
import Navbar from './Navbar.jsx';
import Payment from './Payment.jsx';
import FeedContainer from './FeedContainer.jsx';
import MiniProfile from './MiniProfile.jsx';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      balance: undefined
    }
  }

  render() {
    return (
      <div>
        <MiniProfile balance={this.props.balance} userInfo={this.props.userInfo}/>
        <Payment payerId={this.props.userInfo.userId} />
        <FeedContainer 
          userId={this.props.userInfo.userId}
          loadMoreFeed={this.props.loadMoreFeed}
          userFeed={this.props.userFeed}
          globalFeed={this.props.globalFeed} />
      </div>
    );
  }
}

export default Home;