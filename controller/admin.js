const express = require('express')
const router = express.Router();
const con = require('../models/config/database')

router.get('/', function (req, res) {

    const sql = "select name_shop,user_id from usersprofile ";
    con.query(sql, (err, result) => {
      if(err){
        console.log('err database')
      }
      console.log(result)
      res.render('pages/admin', { 
          usersList : result
      })
    });
})

module.exports = router;