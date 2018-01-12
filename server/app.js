const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('../database/queries.js');
const helpers = require('./helpers.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + '/../client/dist'));


app.post('/login', (req, res) => {
  var {username, password} = req.body;
  db.getPasswordAtUsername(username, (err, row) => {
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
  db.profile.getUserInfo(userId, (err, row) => {
    if (err) {
      console.error("Error retrieving from database: ", err);
      res.status(500).json(err);
    } else {
      if (row.length) {
        var ui = row[0];
        var userInfo = {
          userId: ui.id,
          username: ui.username,
          displayName: ui.first_name + ' ' + ui.last_name,
          avatarUrl: ui.avatar_url
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


app.post('/signup', (req, res) => {
  db.signup.newUserSignup(req.body, 100)
    .then(userId => {
      res.status(201).json({ userId: userId });
    })
    .catch(err => {
      console.error('error on user signup:', err);
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
  db.payment(req.body)
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
  let limit = 2;

  // Grab limit + 1 items from the database, so we can return a next page token
  // for pagination

  let limitId = req.query['startingTransactionId']; 

  db.globalFeed(limit + 1, limitId)
    .then((results) => {
      res.status(200).json(helpers.buildFeedObject(results, limit));
    })
    .catch((err) => {
      console.error('error retrieving global feed: ', err);
      res.sendStatus(500).json({error: 'server error'});
    })
});

app.get('/feed/user/:userId', (req, res) => {
  let userId = req.params && req.params.userId;
  let limit = 25;

  if (isNaN(userId)) {
    res.sendStatus(400).json({ error: "Improper format." });
    return;
  }

  db.myFeed(limit, userId)
    .then((results) => {
      res.status(200).json({items: results});
    })
    .catch((err) => {
      console.error('error retrieving user feed: ', err);
      res.sendStatus(500).json({error: 'server error'});
    })
});


module.exports = app;

