import React from 'react';
import Navbar from './Navbar.jsx';
import Payment from './Payment.jsx';
import FeedContainer from './FeedContainer.jsx';
import MiniProfile from './MiniProfile.jsx';
import NavBar from './Navbar.jsx';

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
        <NavBar 
          isLoggedIn={this.props.isLoggedIn} 
          logUserOut={this.props.logUserOut} />
        <Payment/>
        <MiniProfile 
          balance={this.props.balance} 
          userInfo={this.props.userInfo}/>
        <FeedContainer
          view={this.extractView(this.props.location) || 'mine'}
          userFeed={this.props.userFeed && this.props.userFeed.items}
          globalFeed={this.props.globalFeed && this.props.globalFeed.items} 
          />
      </div>
    );
  }
}

export default Home;