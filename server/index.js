const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('hello world! unchanged');
}) 


var port = process.env.PORT || 3000;
app.listen(port, () => console.log('HRPaymo is listening on', port));