const express = require('express');

//create a router in express
const router = express.Router();

const { getFileStream } = require('../s3');

router.get('/:key', (req, res) => {
    const key = req.params.key
    const readStream = getFileStream(key)

    readStream.pipe(res)
})

module.exports = router;