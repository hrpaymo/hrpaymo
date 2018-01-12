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
        <Payment/>
        <MiniProfile balance={this.props.balance} userInfo={this.props.userInfo}/>
        <FeedContainer
          view={this.props.match && this.props.match.params && this.props.match.params.id || 'mine'}
          userFeed={this.props.userFeed && this.props.userFeed.items}
          globalFeed={this.props.globalFeed && this.props.globalFeed.items} 
          />
      </div>
    );
  }
}

export default Home;