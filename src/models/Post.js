const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    matchId: String,
    data: Object
});


module.exports = mongoose.model('posts', PostSchema);