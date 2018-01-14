import React from 'react';
import Navbar from './Navbar.jsx';
import Payment from './Payment.jsx';
import FeedContainer from './FeedContainer.jsx';
import ProfileHeader from './ProfileHeader.jsx';
import axios from 'axios';

class Profile extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      profileInfo: {},
      unknownUser: false,
      profileFeed: {},
      relationalFeed: {}
    }
  }

  componentDidMount() {
    let profileUsername = this.props.match.params.username;
    let loggedInUserId = this.props.userInfo.userId;
    this.loadProfileData(profileUsername);
    this.getProfileFeed(profileUsername, loggedInUserId, null);
    this.getRelationalFeed(profileUsername, loggedInUserId, null);
  }

  prependNewTransactions(feedType, transactionSummary) {
    if (!transactionSummary || transactionSummary.count === 0) {
      return;
    }

    // If there is no existing data in the feed, set the transaction summary
    if (!this.state[feedType].count || this.state[feedType].count === 0) {
        this.setState({
          [feedType]: transactionSummary
        });  
    } else {
      // If there is already existing data in the feed, combine them to prepend the new 
      // transactions to the top
      let combinedItems = transactionSummary.items.concat(this.state[feedType].items);

      // Might be a better design to make a deep copy of state and then 
      // manipulate. See the module "immutability-helper"

      let newFeedState = {
        items: combinedItems,
        count: (this.state[feedType].count || 0) + transactionSummary.count,
        nextPageTransactionId: this.state[feedType].nextPageTransactionId,
        newestTransactionId: transactionSummary.newestTransactionId
      }

      this.setState({
        [feedType]: newFeedState
      })
    }
  }

  loadProfileData(username) {
    axios('/publicprofile', {params: {username: username}})
      .then((response) => {
        this.setState({
          profileInfo: response.data
        });
      })
      .catch((err) =>{
        this.setState({
          unknownUser: true
        })
        console.error(err);
      });
  }

  getProfileFeed(username, userId, sinceId = null) {
    let params = {
      sinceId: sinceId,
      userId: userId,
      profileUsername: username
    }

    axios('/feed/global', {params: params})
      .then((response) => {
        this.prependNewTransactions('profileFeed', response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getRelationalFeed(username, userId, sinceId = null) {
    let params = {
      sinceId: sinceId,
      userId: userId,
      profileUsername: username
    }

    axios('/feed/global', {params: params})
      .then((response) => {
        this.prependNewTransactions('relationalFeed', response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <Navbar 
          isLoggedIn={this.props.isLoggedIn} 
          logUserOut={this.props.logUserOut} />
        {this.state.unknownUser 
          ? <div>User does not exist</div>
          : <span>
              <ProfileHeader profileInfo={this.state.profileInfo}/>
            </span>
        }
        <FeedContainer 
          userId={this.props.userInfo.userId}
          loadMoreFeed={null}
          base={this.props.match.params.username}
          view={'mine'}
          userFeed={this.state.profileFeed}
          globalFeed={this.state.relationalFeed} 
          />
      </div>
    );
  }
}

export default Profile;