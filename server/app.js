const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sampledata = require('../sampledata.js');
const db = require('../database/queries.js');
var path = require('path');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

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
  // console.log('signup post with data:', req.body);
  db.signup.newUserSignup(req.body, 100)
    .then(userId => {
      console.log('successful signup with userId:', userId);
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

app.get('/feed/global', (req, res) => {
  let limit = 25;
  db.globalFeed(limit)
    .then((results) => {
      res.status(200).json({items: results});
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


<<<<<<< HEAD
=======
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..' , './client/dist/index.html'));
});


>>>>>>> routing with login and signup form working
module.exports = app;

