import React from 'react';
import Navbar from './Navbar.jsx';
import Payment from './Payment.jsx';
import FeedContainer from './FeedContainer.jsx';
import MiniProfile from './MiniProfile.jsx';

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
            userFeed={this.props.userFeed}
            globalFeed={this.props.globalFeed} 
            base='/'
            loadMoreFeed={this.props.loadMoreFeed}
            view={this.extractView(this.props.location) || 'mine'}
          />
        </div>
      </div>
    );
  }
}

export default Home;