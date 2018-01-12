const signup = require('../database/signup.js');
const login = require('../database/login.js');
const feed = require('../database/feed.js');
const profile = require('../database/profile.js');

module.exports = {
  signup: signup,
  login: login,
  profile: profile,
  globalFeed: feed.globalFeed,
  myFeed: feed.myFeed
}