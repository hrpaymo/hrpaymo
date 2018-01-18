const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('../database/queries.js');
const helpers = require('./helpers.js');
var path = require('path');
const _ = require('underscore');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + '/../client/dist'));

app.post('/login', (req, res) => {
  var {idToken} = req.body;
  helpers.validateIdToken(idToken)
    .then((user) => {
      db.loginOrCreate(user)
        .then((result) => {
          res.status(200).json(user.sub);
        })
    })
    .catch((err) => {
      console.log('login failed', err)
    })
});

app.get('/usernames', (req, res) => {
  db.getUsernames(req.query.userId)
  .then(rows => {
    unescapedRows = rows.map(row => {
      return _.unescape(row.username);
    })
    res.json({ usernames: unescapedRows });
  })
  .catch(err => {
    console.error('error on get of usernames:', err.message);
    res.status(400).json({ error : "Improper format." });
  });
})

app.get('/profile', (req, res) => {
  var userId = req.query.userId;
  db.profile.getUserInfo(userId, (err, row) => {
    if (err) {
      console.error("/profile Error retrieving from database: ", err);
      res.status(500).json(err);
    } else {
      if (row.length) {
        var ui = row[0];
        var userInfo = {
          userId: ui.id,
          username: ui.username,
          displayName: ui.first_name + ' ' + ui.last_name,
          createdAt: ui.created_at,
          avatarUrl: ui.avatar_url
        }
        res.status(200).json(userInfo);
      } else {
        res.status(400).json({ error : "No such user in database."});
      }
    }
  });
});

app.get('/balance', (req, res) => {
  var userId = req.query.userId;
  db.profile.getBalance(userId, (err, row) => {
    if (err) {
      console.error("Error retrieving from database: ", err);
      res.status(500).json(err);
    } else {
      if (row.length) {
        var amount = row[0].amount;
        res.status(200).json({amount: amount});
      } else{
        res.status(400).json({ error : "No such user in database."});
      }
    }
  });
});

app.get('/friends', (req, res) => {
  var userId = req.query.userId;
  db.profile.getFriendsList(parseInt(_.escape(userId.replace(/"/g, "'"))), (err, rows) => {
    if (err) {
      console.error('Error occured getting friends list', err);
      res.status(500).json(err);
    } else {
      res.status(200).json({friends: rows});
    }
  })
})

app.post('/pay', (req, res) => {
  // TODO: check if user is still logged in (i.e. check cookie) here. If not, send back appropriate error response.
  let paymentData = {};
  for(let key in req.body) {
    paymentData[key] = req.body[key];
  }
  if(isNaN(parseFloat(paymentData.amount))) {
    console.error('payment amount is not a number:', paymentData.amount);
    res.status(400).json({ error : 'Improper format.' });
    return;
  }
  db.payment(paymentData)
    .then((response) => {
      helpers.sendEmail(response.txnId);
      res.status(201).json({ balance: response.balance });
    })
    .catch(err => {
      console.error('error on payment:', err.message);
      if(err.message.includes('Insufficient funds')) {
        res.status(422).json({ error: 'Insufficient funds.' });
      } else if(err.message.includes('Invalid payee username')) {
        res.status(422).json({ error: 'Invalid payee username.' });
      } else {
        res.status(400).json({ error : 'Improper format.' })
      }
    })
});


app.get('/publicprofile', (req, res) => {
  let username = req.query.username;
  username = username && _.escape(username.replace(/"/g,"'"));

  db.profile.getProfileDataByUsername(username)
    .then((results) => {
      let profile = results[0];
      if (profile) {
        var userInfo = {
          userId: profile.id,
          firstName: _.unescape(profile.first_name),
          username: _.unescape(profile.username),
          fullName: _.unescape(profile.first_name + ' ' + profile.last_name),
          createdAt: _.unescape(profile.created_at),
          avatarUrl: _.unescape(profile.avatar_url)
        }
        res.status(200).json(userInfo);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('error retrieving profile data: ', err);
      res.sendStatus(500).json({error: 'server error'});
    }) 
});

// FEED ENDPOINTS

const FEED_DEFAULT_LENGTH = 5;

app.get('/feed/global', (req, res) => {
  let limit = FEED_DEFAULT_LENGTH;
  let userId = req.query && req.query.userId;
  let beforeId = parseInt(req.query['beforeId']) || null; 
  let sinceId = parseInt(req.query['sinceId']) || null;

  db.globalFeed(limit + 1, beforeId, sinceId, userId)
    .then((results) => {
      let unescapedResults = JSON.parse(_.unescape(JSON.stringify(results)));
      res.status(200).json(helpers.buildFeedObject(unescapedResults, limit));
    })
    .catch((err) => {
      console.error('error retrieving global feed: ', err);
      res.sendStatus(500).json({error: 'server error'});
    })
});

app.get('/feed/user/:userId', (req, res) => {
  let userId = req.params && req.params.userId;

  let limit = FEED_DEFAULT_LENGTH;
  let beforeId = parseInt(req.query['beforeId']) || null; 
  let sinceId = parseInt(req.query['sinceId']) || null;

  if (isNaN(userId)) {
    res.sendStatus(400).json({ error: "Improper format." });
    return;
  }

  db.myFeed(limit + 1, beforeId, sinceId, userId)
    .then((results) => {
      let unescapedResults = JSON.parse(_.unescape(JSON.stringify(results)));
      res.status(200).json(helpers.buildFeedObject(unescapedResults, limit));
    })
    .catch((err) => {
      console.error('error retrieving user feed: ', err);
      res.sendStatus(500).json({error: 'server error'});
    })
});

app.get('/feed/profile', (req, res) => {
  let profileUsername = req.query.profileUsername;
  let loggedInUserId = req.query && req.query.userId;

  profileUsername = profileUsername && _.escape(profileUsername.replace(/"/g,"'"));

  let limit = FEED_DEFAULT_LENGTH;
  let beforeId = parseInt(req.query['beforeId']) || null; 
  let sinceId = parseInt(req.query['sinceId']) || null;

  db.profileFeed(limit + 1, beforeId, sinceId, profileUsername, loggedInUserId)
    .then((results) => {
      let unescapedResults = JSON.parse(_.unescape(JSON.stringify(results)));
      res.status(200).json(helpers.buildFeedObject(unescapedResults, limit));
    })
    .catch((err) => {
      console.error('error retrieving user feed: ', err);
      res.sendStatus(500).json({error: 'server error'});
    })
});

app.get('/feed/relational', (req, res) => {
  let profileUsername = req.query.profileUsername;
  let loggedInUserId = req.query && req.query.userId;
  profileUsername = profileUsername && _.escape(profileUsername.replace(/"/g,"'"));

  let limit = FEED_DEFAULT_LENGTH;
  let beforeId = parseInt(req.query['beforeId']) || null; 
  let sinceId = parseInt(req.query['sinceId']) || null;

  db.profileFeedRelational(limit + 1, beforeId, sinceId, profileUsername, loggedInUserId)
    .then((results) => {
      let unescapedResults = JSON.parse(_.unescape(JSON.stringify(results)));
      res.status(200).json(helpers.buildFeedObject(unescapedResults, limit));
    })
    .catch((err) => {
      console.error('error retrieving user feed: ', err);
      res.sendStatus(500).json({error: 'server error'});
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..' , './client/dist/index.html'));
});

module.exports = app;

