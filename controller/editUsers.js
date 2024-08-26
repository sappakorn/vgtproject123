const express = require('express') //req res redirect 
const router = express.Router()

router.post('/', function (req, res) {
    
    const phone = req.body.phone;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const lo_shop = req.body.lo_shop;
    const name_shop = req.body.name_shop;
    const pp_number = req.body.pp_number;

    console.log(phone+password+first_name+last_name+lo_shop+name_shop+pp_number)
    
    //update 
    const sql = "  ";
    con.query(sql,[id], (err,result)=>{

      if(err){
        res.send(err)
      }else{
        res.send('success')
      }
      
      
    })
})

module.exports = router;
 
