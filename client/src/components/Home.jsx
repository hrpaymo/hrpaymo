import React from 'react';
import Navbar from './Navbar.jsx';
import Payment from './Payment.jsx';
import FeedContainer from './FeedContainer.jsx';
import MiniProfile from './MiniProfile.jsx';

class Home extends React.Component {
  constructor (props) {
    super(props);
  }

  extractView() {
    let search = this.props.location && this.props.location.search;
    return search && search.slice(search.indexOf('=') + 1);
  }

  render() {
    let orderedFeeds = [
      {
        displayLabel: 'mine',
        urlParam: 'mine',
        feedType: 'userFeed',
        data: this.props.userFeed
      },
      {
        displayLabel: 'public',
        urlParam: 'public',
        feedType: 'globalFeed',
        data: this.props.globalFeed
      }
    ];

    return (
      <div>
        <Navbar 
          isLoggedIn={this.props.isLoggedIn} 
          logUserOut={this.props.logUserOut}
        />
        <div className="home">
          <div className="home-leftColumn pay-feed-container">
            <Payment 
              payerId={this.props.userInfo.userId}
              refreshUserData={this.props.refreshUserData} />
            <FeedContainer 
              userId={this.props.userInfo.userId}
              base='/'
              feeds={orderedFeeds}
              loadMoreFeed={this.props.loadMoreFeed}
              view={this.extractView()}
            />
          </div>
          <div className="home-rightColumn">
            <MiniProfile 
              balance={this.props.balance}
              userInfo={this.props.userInfo}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;