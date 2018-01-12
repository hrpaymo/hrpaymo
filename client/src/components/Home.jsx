import React from 'react';
import Navbar from './Navbar.jsx';
import Payment from './Payment.jsx';
import FeedContainer from './FeedContainer.jsx';
import MiniProfile from './MiniProfile.jsx';
import NavBar from './Navbar.jsx';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      balance: undefined
    }
  }

  extractView(location) {
    let search = location.search;
    return search && search.slice(search.indexOf('=') + 1);
  }

  render() {
    return (
      <div>
        <MiniProfile balance={this.props.balance} userInfo={this.props.userInfo}/>
        <Payment 
          payerId={this.props.userInfo.userId} 
          refreshUserData={this.props.refreshUserData} />
        <FeedContainer 
          userId={this.props.userInfo.userId}
          loadMoreFeed={this.props.loadMoreFeed}
          view={this.extractView(this.props.location) || 'mine'}
          userFeed={this.props.userFeed && this.props.userFeed.items}
          globalFeed={this.props.globalFeed && this.props.globalFeed.items} 
        />
      </div>
    );
  }
}

export default Home;