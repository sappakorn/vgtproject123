const express = require('express');
const history = express.Router();
const con = require("../models/config/database");


history.post('/', async (req, res) => {
    const id = req.session.user.id
    console.log(id)
    const show_history =`
    SELECT 
    usersprofile.name_shop,
    history_product.id,
    history_product.user_id,
    history_product.date_time,
    history_product.summary 
    FROM  
        history_product 
    INNER JOIN 
        usersprofile ON usersprofile.user_id = history_product.user_id
    ORDER BY 
        id DESC;
    
    `
    con.query(show_history,[id], function(err, result) {
        if (err) {
            console.error("Error querying database:", err);
            res.redirect('../pages/menu')
        } else {
            console.log(result)
            res.render('./pages/history', {
                result : result     
                
            });
        }
    });

});

module.exports = history;
