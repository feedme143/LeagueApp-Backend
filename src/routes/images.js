const express = require('express');

//create a router in express
const router = express.Router();

const { getFileStream } = require('../s3');

router.get('/:key', async (req, res) => {
    const key = req.params.key

    const readStream = await getFileStream(key);
    readStream.Body.pipe(res);
});

module.exports = router;