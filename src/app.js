//import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
const app = express();

//import routes
const postsRoute = require('./routes/posts');
const summonersRoute = require('./routes/summoners');
const imagesRoute = require('./routes/images');

//middleware
//cors for cross domain functionality
app.use(cors());
//use bodyParser whenever any route is hit
app.use(bodyParser.json());
//routing middleware for posts
app.use('/posts', postsRoute);
//routing middleware for summoners
app.use('/summoners', summonersRoute);
//routing middleware from images
app.use('/images', imagesRoute);

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

//listen to some port
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));