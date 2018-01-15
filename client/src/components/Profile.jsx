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
    this.getProfileFeeds('profileFeed', userId, null, profileUsername);
   // this.getFeed('relationalFeed', userId, null, profileUsername);
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.match.url !== nextprops.match.url) {
      console.log('new page')
      router.replace(location);
    }
  }

  getProfileFeeds(feedType, userId = null, sinceId, profileUsername) {
    let endpoint = FEED_ENDPOINTS[feedType];
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
      beforeId: this.state[feedType].nextPageTransactionId,
      userId: userId,
      profileUsername: this.props.match.params.username
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
    
    // For a user's own profile page, only show a single feed 
    if (this.props.userInfo.username === this.props.match.params.username) {
      orderedFeeds = orderedFeeds.slice(0,1);
      orderedFeeds[0].displayLabel = 'Your Feed';
    }

    return (
      <div>
        <Navbar 
          isLoggedIn={this.props.isLoggedIn} 
          logUserOut={this.props.logUserOut} />
        {this.state.unknownUser 
          ? <div>User does not exist</div>
          : <span>
              <ProfileHeader 
                profileInfo={this.state.profileInfo}
                />
              <FeedContainer       
                userId={this.props.userInfo.userId}
                loadMoreFeed={this.loadMoreFeed.bind(this)}
                feeds={orderedFeeds}
                base={this.props.match.params.username}
                view={this.extractView()}
                />
            </span>
        }
      </div>
    );
  }
}

export default Profile;
