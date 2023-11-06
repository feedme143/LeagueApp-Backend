const mongoose = require('mongoose');

const SummonerSchema = new mongoose.Schema({
    name_lowercase: String,
    name: String,
    puuid: String,
    level: Number,
    games: [String],
    lastUpdated: Number
});


module.exports = mongoose.model('summoners', SummonerSchema);