const signup = require('../database/signup.js');
const login = require('../database/login.js');
const feed = require('../database/feed.js');

module.exports = {
  signup: signup,
  login: login,
  globalFeed: feed.globalFeed,
  myFeed: feed.myFeed
}