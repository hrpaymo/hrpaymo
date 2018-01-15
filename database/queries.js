const signup = require('../database/signup.js');
const login = require('../database/login.js');
const feed = require('../database/feed.js');
const profile = require('../database/profile.js');
const payment = require('../database/pay.js');
const usernames = require('../database/usernames.js');

module.exports = {
  signup: signup,
  profile: profile,
  getPasswordAtUsername: login.getPasswordAtUsername,
  payment: payment.pay,
  getUsernames: usernames.getUsernames,
  globalFeed: feed.globalFeed,
  myFeed: feed.myFeed,
  profileFeed: feed.profileFeed,
  profileFeedRelational: feed.profileFeedRelational
}