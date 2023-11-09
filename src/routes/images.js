const express = require('express');

//create a router in express
const router = express.Router();

const { getS3File } = require('../s3');

router.get('/:prefix/:key', async (req, res) => {
    const prefix = req.params.prefix;
    /* 
    prefix:
        items,
        champicons,
        profileicons
    */
    const key = req.params.key

    const readStream = await getS3File(key, prefix);
    readStream.Body.pipe(res);
});

module.exports = router;