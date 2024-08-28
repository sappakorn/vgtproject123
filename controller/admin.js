const express = require('express')
const router = express.Router();
const con = require('../models/config/database')

router.get('/', function (req, res) {
  
    const sql = "select name_shop,user_id from usersprofile ";
    con.query(sql, (err, result) => {
      if(err){
        console.log('err database')
      }

    const sql = "select first_name,customer_id from customers ";
    con.query(sql, (err, result1) => {
        if(err){
            console.log('err database')
        }
        console.log(result1)
        res.render('pages/admin', { 
            customerList : result1,
            usersList : result
        })
    });
      
    });
})

module.exports = router;