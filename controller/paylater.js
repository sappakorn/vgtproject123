const express = require('express')
const con = require('../models/config/database');
const { cache } = require('ejs');
const router = express.Router();

router.get('/', (req, res) => {
    const user_id = req.session.user.user_id;
    
    try {
        const sql = 'select '
        res.render('pages/paylater',{

        })
    } catch (error) {
        
    }
    
})

module.exports = router;