const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//middleware allow request from all server
const cors = require('cors');
app.use(cors());

//middleware for parsing request bodies
app.use(express.json());

// Mount apiRouter
const apiRouter = require('./server/api');
app.use('/api', apiRouter);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });


//assign PORT
const PORT = process.env.PORT || 5000;

//server listening to PORT
app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`);
})

module.exports = app;