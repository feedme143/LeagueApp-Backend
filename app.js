//import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
const app = express();

//import routes
const postsRoute = require('./routes/posts');

//middleware
//cors for cross domain functionality
app.use(cors());
//use bodyParser whenever any route is hit
app.use(bodyParser.json());
app.use('/posts', postsRoute);

//exmaple of a get request route
app.get('/', (req,res) => {
    res.send("we are on home");
});

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION)
.then(() => {
    console.log("Connected to DB");
})
.catch(err => {
    console.log(err);
});

//listen to port 3000
app.listen(3001);