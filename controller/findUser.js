const express = require('express'); //req res redirect 
const router = express.Router()
const con = require('../models/config/database')



router.post('/',(req,res)=>{

    const id = req.body.user_id 

    const sql = "select * from usersprofile where user_id = ? ";
    con.query(sql,[id], (err,result)=>{

      if(err){
        res.send(err)
      }
      res.render('pages/update_store',{
        userList : result,
        user_id:id
      })
      
    })
})

module.exports = router;