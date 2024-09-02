const express = require('express')
const con = require('../models/config/database');
const router = express.Router();

router.get('/', (req, res) => {
    
    res.render('pages/paylater',{})
})

module.exports = router;