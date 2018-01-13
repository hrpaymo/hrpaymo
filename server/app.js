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
  var {username, password} = req.body;
  db.getPasswordAtUsername(_.escape(username), (err, row) => {
    if (err) {
      console.error("Error retrieving from database: ", err);
      res.status(500).json(err);
    } else {
      if (row.length) {
        if (row[0].password === password) {
          res.status(200).json({ userId: row[0].id });
        } else {
          res.status(401).json({ error : "Incorrect password"});
        }
      } else{
        res.status(401).json({ error : "Invalid username"});
      }
    }
  });
});

app.get('/profile', (req, res) => {
  var userId = req.query.userId;
  db.profile.getUserInfo(parseInt(_.escape(userId)), (err, row) => {
    if (err) {
      console.error("Error retrieving from database: ", err);
      res.status(500).json(err);
    } else {
      if (row.length) {
        var ui = row[0];
        var userInfo = {
          userId: ui.id,
          username: _.unescape(ui.username),
          displayName: _.unescape(ui.first_name + ' ' + ui.last_name),
          avatarUrl: _.unescape(ui.avatar_url)
        }
        res.status(200).json(userInfo);
      } else{
        res.status(400).json({ error : "No such user in database."});
      }
    }
  });
});


app.get('/balance', (req, res) => {
  var userId = req.query.userId;
  db.profile.getBalance(parseInt(_.escape(userId)), (err, row) => {
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


app.post('/signup', (req, res) => {
  let signupData = {};
  for(let key in req.body) {
    signupData[_.escape(key)] = _.escape(req.body[key]);
  }
  db.signup.newUserSignup(signupData, 100)
    .then(userId => {
      res.status(201).json({ userId: userId });
    })
    .catch(err => {
      console.error('error on user signup:', err.message);
      // TODO: send responses depending on what type of error is thrown
      if(err.constraint.includes('users_user')) {
        res.status(422).json({ error : "Username must be unique." });
      } else if(err.constraint.includes('users_email')) {
        res.status(422).json({ error: "Email must be unique." });
      } else if(err.constraint.includes('users_phone')) {
        res.status(422).json({ error: "Phone number must be unique." });
      } else {
        res.status(400).json({ error: "Improper format." });
      }
    })
})

app.post('/pay', (req, res) => {
  // TODO: check if user is still logged in (i.e. check cookie) here. If not, send back appropriate error response.
  let paymentData = {};
  for(let key in req.body) {
    paymentData[_.escape(key)] = _.escape(req.body[key]);
  }
  if(isNaN(parseFloat(paymentData.amount))) {
    console.error('payment amount is not a number:', paymentData.amount);
    res.status(400).json({ error : 'Improper format.' });
    return;
  }
  db.payment(paymentData)
    .then(balance => {
      res.status(201).json({ balance: balance });
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

app.get('/feed/global', (req, res) => {
  let limit = 5;
  let beforeId = parseInt(req.query['beforeId']) || null; 
  let sinceId = parseInt(req.query['sinceId']) || null;

  db.globalFeed(limit + 1, beforeId, sinceId)
    .then((results) => {
      unescapedResults = JSON.parse(_.unescape(JSON.stringify(results)));
      res.status(200).json(helpers.buildFeedObject(unescapedResults, limit));
    })
    .catch((err) => {
      console.error('error retrieving global feed: ', err);
      res.sendStatus(500).json({error: 'server error'});
    })
});

app.get('/feed/user/:userId', (req, res) => {
  let userId = req.params && parseInt(req.params.userId);

  let limit = 5;
  let beforeId = parseInt(req.query['beforeId']) || null; 
  let sinceId = parseInt(req.query['sinceId']) || null;

  if (isNaN(userId)) {
    res.sendStatus(400).json({ error: "Improper format." });
    return;
  }

  db.myFeed(limit + 1, beforeId, sinceId, userId)
    .then((results) => {
      unescapedResults = JSON.parse(_.unescape(JSON.stringify(results)));
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

