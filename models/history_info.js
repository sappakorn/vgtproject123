const express = require('express');
const history_info = express.Router();
const con = require("../models/config/database");




history_info.post('/', async (req, res) => {

    const history_id = req.body.history_id
    const show_history = "SELECT * FROM history_product WHERE id = ?";
    con.query(show_history,[history_id], function(err, result) {
        if (err) {
            console.error("Error querying database:", err);
            res.render('pages/error', { error: err });
        } else {
            const Date_time = result[0].date_time;
            const sum = result[0].summary;
            const orderData = JSON.parse(result[0].order_data);
            res.render('./pages/history_info', {
              orderData: orderData,
              Date_time : Date_time,
              sum : sum
             });
        }
    });
  
});

module.exports = history_info;
