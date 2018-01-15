import React from 'react';
import Navbar from './Navbar.jsx';
import Payment from './Payment.jsx';
import FeedContainer from './FeedContainer.jsx';
import ProfileHeader from './ProfileHeader.jsx';
import axios from 'axios';

const FEED_ENDPOINTS = {
  'profileFeed': '/feed/profile',
  'relationalFeed': '/feed/relational'
}

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
    let userId = this.props.userInfo.userId;
    this.loadProfileData(profileUsername);
    this.getFeed('profileFeed', userId, null, profileUsername);
    this.getFeed('relationalFeed', userId, null, profileUsername);
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

  getFeed(feedType, userId = null, sinceId = null, profileUsername) {
    let endpoint = FEED_ENDPOINTS[feedType];
    if (feedType === 'userFeed') {
      endpoint = `${endpoint}/${userId}`;
    }
    let params = {
      sinceId: sinceId,
      userId: userId,
      profileUsername: profileUsername
    }

    axios(endpoint, {params: params})
      .then((response) => {
        this.prependNewTransactions(feedType, response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  mergeFeeds(newerFeed, olderFeed) {
    // If there is already existing data in the feed, combine them, prepending the 
    // more recent transactions to the top
    let combinedItems = (newerFeed.items || []).concat(olderFeed.items || []);

    // Update feed meta-data to accurately reflect combined data
    let combinedFeedObject = {
      items: combinedItems,
      count: (newerFeed.count || 0) + (olderFeed.count || 0),
      nextPageTransactionId: olderFeed.nextPageTransactionId || null,
      newestTransactionId: newerFeed.newestTransactionId || null
    }

    return combinedFeedObject;
  }

  prependNewTransactions(feedType, transactionSummary) {
    // If no results return, do nothing
    if (!transactionSummary || transactionSummary.count === 0) {
      return;
    }

    // If feed was empty, set the returned transactions as the feed
    let isFeedEmpty = !this.state[feedType].count || this.state[feedType].count === 0;

    let newFeedObject = isFeedEmpty
      ? transactionSummary
      : this.mergeFeeds(transactionSummary, this.state[feedType]);

    this.setState({
      [feedType]: newFeedObject
    })
  }

  loadMoreFeed(feedType, userId) {
    let endpoint = FEED_ENDPOINTS[feedType];

    if (feedType === 'userFeed') {
      endpoint = `${endpoint}/${userId}`;
    } 

    // Send along the next valid ID you'd like returned back
    // from the database
    let params = {
      beforeId: this.state[feedType].nextPageTransactionId
    }

    axios(endpoint, {params: params})
      .then((response) => {

        // Confirm there additional items to load
        if (response.data && response.data.count > 0) {
          let combinedItems = this.mergeFeeds(this.state[feedType], response.data);

          this.setState({
            [feedType]: combinedItems
          })
        }
      })
      .catch((err) => {
        console.error(err);
      }); 
  }

  extractView() {
    let search = this.props.location && this.props.location.search;
    return search && search.slice(search.indexOf('=') + 1);
  }

  render() {
    let orderedFeeds = [
      {
        displayLabel: `${this.state.profileInfo.firstName}'s Feed`,
        urlParam: 'all',
        feedType: 'profileFeed',
        data: this.state.profileFeed
      },
      {
        displayLabel: `Between You & ${this.state.profileInfo.firstName}`,
        urlParam: 'mutual',
        feedType: 'relationalFeed',
        data: this.state.relationalFeed
      }
    ];

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
          loadMoreFeed={this.loadMoreFeed.bind(this)}
          feeds={orderedFeeds}
          base={this.props.match.params.username}
          view={this.extractView()}
          />
      </div>
    );
  }
}

export default Profile;