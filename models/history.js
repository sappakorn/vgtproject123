const express = require('express');
const history = express.Router();
const con = require("../models/config/database");




history.post('/', async (req, res) => {

    const id = req.session.user.id

    try {
        const sql = "SELECT * FROM history WHERE user_id";
        con.query(sql, [id], async (err, result) => {
            if (err) {
                return res.status(500).send(err.message); 
            }
            res.render('pages/history',{history_p : result})

           
        });
        
    } catch (error) {
        
    }
  
});

module.exports = history;
