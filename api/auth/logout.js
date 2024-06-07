const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    req.session = null;
    res.redirect('/');
    console.log('logout success!');
});

module.exports = router;
