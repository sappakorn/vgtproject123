const express = require('express');
const history = express.Router();
const con = require("../models/config/database");




history.post('/', async (req, res) => {

    const show_history = "SELECT * FROM history_product ";
    con.query(show_history, function(err, result) {
        if (err) {
            console.error("Error querying database:", err);
            res.redirect('../pages/menu')
        } else {

            res.render('./pages/history', {
                result : result,        
            });
        }
    });

});

module.exports = history;
