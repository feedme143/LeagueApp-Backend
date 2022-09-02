const mongoose = require('mongoose');

const SummonerSchema = new mongoose.Schema({
    name: String,
    puuid: String,
    level: Number,
    games: [String]
});


module.exports = mongoose.model('summoners', SummonerSchema);