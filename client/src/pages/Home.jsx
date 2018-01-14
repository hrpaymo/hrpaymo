import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Payment from '../components/Payment.jsx';
import FeedContainer from '../components/FeedContainer.jsx';
import MiniProfile from '../components/MiniProfile.jsx';

class Home extends React.Component {
  constructor (props) {
    super(props);
  }

  extractView(location) {
    let search = location.search;
    return search && search.slice(search.indexOf('=') + 1);
  }

  render() {
    return (
      <div>
        <Navbar 
          isLoggedIn={this.props.isLoggedIn} 
          logUserOut={this.props.logUserOut} />
        <MiniProfile balance={this.props.balance} userInfo={this.props.userInfo}/>
        <div className="pay-feed-container">
        <Payment 
          payerId={this.props.userInfo.userId}
          usernames={this.props.usernames}
          refreshUserData={this.props.refreshUserData} />
        <FeedContainer 
          userId={this.props.userInfo.userId}
          loadMoreFeed={this.props.loadMoreFeed}
          view={this.extractView(this.props.location) || 'mine'}
          userFeed={this.props.userFeed}
          globalFeed={this.props.globalFeed} 
        />
        </div>
      </div>
    );
  }
}

export default Home;