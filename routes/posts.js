const express = require('express');
const Post = require('../models/Post');

//create a router in express
const router = express.Router();

//use the post model schema for data
const postModel = require('../models/Post')

//return all posts 
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
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
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch(err) {
        res.json({ message: err });
    }
});

module.exports = router;