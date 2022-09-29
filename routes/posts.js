const axios = require('axios');

//init axios
const api = axios.create()
const matchV5 = 'https://americas.api.riotgames.com/lol/match/v5/matches';

const express = require('express');

//create a router in express
const router = express.Router();

//use the post model schema for data
const postModel = require('../models/Post')

//return all posts 
router.get('/', async (req, res) => {
    try {
        const posts = await summonerModel.find();
        res.json(posts);
    } catch(err) {
        res.json({ message: err });
    }
});

//add a post to the database
router.post('/', async (req,res) => {
    const post = new postModel({
        matchId: req.body.matchId,
        data: req.body.data
    });
    
    try {
        const savedPost = await post.save(); //promise of saving post to database
        res.json(savedPost);
    } catch(err) {
        console.log(err);
        res.json({message: err});
    }
});

//get a specific post
router.get('/:matchId', async (req, res) => {
    try {
        const post = await postModel.findOne({matchId: req.params.matchId});
        //if found, add my data, else fetch from riot
        const data = post ? post : await getData();
        
        async function getData() { //get game data from riot and save to my databse
            const re = await api.get(`${matchV5}/${req.params.matchId}?api_key=${process.env.API_KEY}`);
            const dat = re.data;
            api.post('http://localhost:3001/posts', {matchId: req.params.matchId, data: dat});

            return {matchId: req.params.matchId, data: dat};
        }

        res.json(data);

    } catch(err) {
        res.json({ message: err });
    }
});

module.exports = router;