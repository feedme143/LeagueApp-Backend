const express = require('express');
const axios = require('axios');

//init axios
const api = axios.create()
const summonerV4 = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name';
const matchV5 = 'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid';

//create a router in express
const router = express.Router();

//use the summoner model schema for data
const summonerModel = require('../models/Summoner')

//return all summoners 
router.get('/', async (req, res) => {
    try {
        const summoners = await summonerModel.find();
        res.json(summoners);
    } catch(err) {
        res.json({ message: err });
    }
});

//add a summoner to the database
router.post('/', async (req, res) => {
    const summoner = new summonerModel({
        name: req.body.name,
        puuid: req.body.puuid,
        level: req.body.level,
        games: req.body.games
    });
    
    try {
        const savedSummoner = await summoner.save(); //promise of saving post to database
        res.json(savedSummoner);
    } catch(err) {
        console.log(err);
        res.json({message: err});
    }
});
//get a specific post
router.get('/:summonerName', async (req, res) => {
    try {
        const summoner = await summonerModel.find({name: req.params.summonerName});

        if (summoner.length > 0)
            res.json(summoner);

        else {
            //get summoner data from name
            const summonerRes = await api.get(`${summonerV4}/${req.params.summonerName}?api_key=${process.env.API_KEY}`);
            const name = summonerRes.data.name;
            const puuid = summonerRes.data.puuid;
            const level = summonerRes.data.summonerLevel;
            
            if (summonerRes) {
                //get matches from puuid
                const matchRes = await api.get(`${matchV5}/${puuid}/ids?start=0&count=10&api_key=${process.env.API_KEY}`)
                const games = matchRes.data;

                //create summoner
                const summoner = new summonerModel({
                    name: name,
                    puuid: puuid,
                    level: level,
                    games: games
                });

                //save summoner profile to database
                try {
                    const savedSummoner = await summoner.save(); //promise of saving post to database
                    res.json(savedSummoner); //return the saved summoner
                } catch(err) {
                    console.log(err);
                    res.json({message: err});
                }
            }
        }

    } catch(err) {
        res.json({ message: err });
    }
});

module.exports = router;