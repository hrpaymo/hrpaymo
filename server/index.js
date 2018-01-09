const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('hello world! change is made!');
}) 


var port = process.env.PORT || 3000;
app.listen(port, () => console.log('HRPaymo is listening on', port));