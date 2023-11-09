const mongoose = require('mongoose');

const SummonerSchema = new mongoose.Schema({
    name_lowercase: String,
    name: String,
    puuid: String,
    level: Number,
    profileIcon: String,
    games: [String],
    ranked: Object,
    lastUpdated: Number
});


module.exports = mongoose.model('summoners', SummonerSchema);