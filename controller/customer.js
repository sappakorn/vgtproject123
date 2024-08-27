const express = require('express')
const router = express.Router();
const con = require('../models/config/database')

router.get('/', function (req, res) {

    const sql = "select first_name,customer_id from customers ";
    con.query(sql, (err, result) => {
        if(err){
            console.log('err database')
        }
        console.log(result)
        res.render('pages/admin', { 
            customerList : result
        })
    });
})

module.exports = router;