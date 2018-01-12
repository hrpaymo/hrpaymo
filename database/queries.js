const signup = require('../database/signup.js');
const login = require('../database/login.js');
const feed = require('../database/feed.js');
const profile = require('../database/profile.js');
const payment = require('../database/pay.js');

module.exports = {
  signup: signup,
  profile: profile,
  getPasswordAtUsername: login.getPasswordAtUsername,
  globalFeed: feed.globalFeed,
  myFeed: feed.myFeed,
  payment: payment.pay
}