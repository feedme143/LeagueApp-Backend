const express = require('express');

//create a router in express
const router = express.Router();

const { getS3File } = require('../s3');

router.get('/items/:key', async (req, res) => {
    const key = req.params.key

    const readStream = await getS3File(key, "items");
    readStream.Body.pipe(res);
});

router.get('/icons/:key', async (req, res) => {
    const key = req.params.key

    const readStream = await getS3File(key, "icons");
    readStream.Body.pipe(res);
});

module.exports = router;