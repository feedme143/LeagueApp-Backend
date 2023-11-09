const express = require('express');
const axios = require('axios');

//init axios
const api = axios.create()
const summonerV4 = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name';
const matchV5 = 'https://americas.api.riotgames.com/lol/match/v5/matches';
const leagueV4 = 'https://na1.api.riotgames.com/lol/league/v4';

//create a router in express
const router = express.Router();

//use the summoner model schema for data
const summonerModel = require('../models/Summoner')
//use the postModel schema for each match info
const postModel = require('../models/Post')

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
        name_lowercase: req.body.name_lowercase,
        name: req.body.name,
        puuid: req.body.puuid,
        level: req.body.level,
        profileIcon: req.body.profileIcon,
        games: req.body.games,
        ranked: req.body.ranked,
        lastUpdated: req.body.lastUpdated
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
    const searchNameLower = req.params.summonerName.toLowerCase();
    encodedName = encodeURIComponent(searchNameLower);
    try {
        const summoner = await summonerModel.findOne({name_lowercase: searchNameLower});
        
        if (summoner) { //if the id is found in my databse
            let matches = []; //fetch the games from my database
            for (let i in summoner.games) {
                const response = await api.get(`http://localhost:8080/posts/${summoner.games[i]}`);
                const d = response.data;
                if(!d){
                    console.log("Game data is not stored in db for summoner " + summoner.name);
                }
                matches.push(d.data);
            }


            
            res.json({ //return the wanted player data
                name: summoner.name,
                puuid: summoner.puuid,
                level: summoner.level,
                profileIcon: summoner.profileIcon,
                games: matches,
                ranked: summoner.ranked,
                lastUpdated: summoner.lastUpdated
            });
            
        }

        else {
            //get summoner data from name
            const summonerRes = await api.get(`${summonerV4}/${encodedName}?api_key=${process.env.API_KEY}`);
            const summonerData = summonerRes.data;

            const name = summonerData.name;
            const puuid = summonerData.puuid;
            const profileIcon =summonerData.profileIconId;
            const id = summonerData.id;
            const level = summonerData.summonerLevel;

            const lastUpdated = Date.now();
            
            if (summonerRes) {
                //get ranked info
                const rankedRes = await api.get(`${leagueV4}/entries/by-summoner/${id}?api_key=${process.env.API_KEY}`);
                const ranked = rankedRes.data;

                //get match ids from puuid
                const matchRes = await api.get(`${matchV5}/by-puuid/${puuid}/ids?start=0&count=10&api_key=${process.env.API_KEY}`);
                const games = matchRes.data;

                //create summoner
                const summoner = new summonerModel({
                    name_lowercase: searchNameLower,
                    name: name,
                    puuid: puuid,
                    level: level,
                    profileIcon: profileIcon,
                    games: games,
                    ranked: ranked,
                    lastUpdated: lastUpdated
                });

                //save summoner profile to database
                try {
                    const savedSummoner = await summoner.save(); //promise of saving post to database

                    //retrieve matches for the profile which we don't have stored in the database
                    const matches = await Promise.all( 
                        savedSummoner.games.map(async id => {
                            //call to my own api
                            const r = await api.get(`http://localhost:8080/posts/${id}`);
                            const d = r.data;
                            //if found, add my data, else fetch from riot
                            const data = d ? d.data : await getData();
                            
                            async function getData() { //Future note: maybe implement this functionality directly into /posts/get
                                const re = await api.get(`${matchV5}/${id}?api_key=${process.env.API_KEY}`);
                                const dat = re.data;
                                api.post('http://localhost:8080/posts', {matchId: id, data: dat});
        
                                return dat;
                            }
        
                            return data;
                        })
                    ) 

                    res.json({ //return the wanted data
                        name: savedSummoner.name,
                        puuid: savedSummoner.puuid,
                        level: savedSummoner.level,
                        profileIcon: savedSummoner.profileIcon,
                        games: matches,
                        ranked: savedSummoner.ranked,
                        lastUpdated: savedSummoner.lastUpdated
                    });

                } catch(err) {
                    console.log(err);
                }
            }
        }

        //fetch each match from database/riot api

            // pageData.matchData = await Promise.all(
            //     pageData.games.map(async (id) => {
            //         const response = await api.get(`http://localhost:3001/posts/${id}`)
            //         const d = response.data
            //         return d.data
            //     })
            // );  

    } catch(err) {
        console.log(err);
        res.json({ message: err });
    }
});

router.put('/:summonerName', async (req, res) => { //Update method
    try {
        encodedName = encodeURIComponent(req.params.summonerName);
        const summonerRes = await api.get(`${summonerV4}/${encodedName}?api_key=${process.env.API_KEY}`); //fetch summoner data from riot
        const summonerData = summonerRes.data;

        const puuid = summonerData.puuid;
        const id = summonerData.id;
        const level = summonerData.summonerLevel;
        const profileIcon = summonerData.profileIconId;
        const lastUpdated = Date.now();

        const query = {name: [encodedName]}

        //fetch the ranked data
        const rankedRes = await api.get(`${leagueV4}/entries/by-summoner/${id}?api_key=${process.env.API_KEY}`);
        const ranked = rankedRes.data;

        //fetch last 10 games to update games arr
        const matchRes = await api.get(`${matchV5}/by-puuid/${puuid}/ids?start=0&count=10&api_key=${process.env.API_KEY}`); 
        const games = matchRes.data;

        let newValues = { $set: { games: games, ranked: ranked, level: level, profileIcon: profileIcon, lastUpdated: lastUpdated} };

        const summoner = await summonerModel.updateOne(query, newValues); //update document in mongodb with new data


        let matches = []; //fetch the games from my database
        for (let i in games) {
            const response = await api.get(`http://localhost:8080/posts/${games[i]}`);
            const d = response.data;
            if(!d){
                console.log("Game data is not stored in db for summoner " + params.req.summonerName);
            }
            matches.push(d.data);
        }
        
        res.json({ //return the wanted player data
            name: summonerRes.data.name,
            puuid: puuid,
            level: level,
            profileIcon, profileIcon,
            games: matches,
            ranked: ranked,
            lastUpdated: lastUpdated
        });
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;