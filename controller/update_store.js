const express = require('express')
const router = express.Router();
const con = require('../models/config/database')

router.get('/', function (req, res) {

    const id = req.session.user.user_id 

    const sql = "select * from usersprofile where user_id = ? ";
    con.query(sql,[id], (err, result) => {
      if(err){
        console.log('err database')
      }
      console.log(result)
        res.render('pages/update_store', { 
          user_profile : result,
          id:id
      })
    })
})

module.exports = router;