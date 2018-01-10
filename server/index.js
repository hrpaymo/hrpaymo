const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sampledata = require('../sampledata.js');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/../client/dist'));

app.get('/feed/global', (req, res) => {

  // DB query should replace default promise
  Promise.resolve(sampledata.sampleFeed)
    .then((results) => {
      res.status(200).json({items: results});
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    })

});

app.get('/feed/user/:userId', (req, res) => {
  
  // DB query should replace default promise
  let userId = req.params && req.params.userId;

  Promise.resolve(sampledata.sampleFeed)
    .then((results) => {
      res.status(200).json({items: results});
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    })
});

module.exports = app;

