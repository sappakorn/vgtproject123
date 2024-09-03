const express = require('express')
const con = require('../models/config/database');
const router = express.Router();
const moment = require('moment-timezone');
require('moment/locale/th');

router.get('/', (req, res) => {
    const user_id = req.session.user.user_id;
    
    try {
        const sql = 'SELECT * FROM paylater WHERE user_id = ?'
        con.query(sql, [user_id], (error, result) => {
            if(error){
                console.log(error)
            }else{
                //ฟังก์ชันวันที่ไทย
                const transformedResult = result.map(item => ({
                    ...item,
                    due_date: moment(item.due_date).tz('Asia/Bangkok').local('th').format('D MMMM YYYY เวลา HH:mm:ss')
                }));

                console.log(transformedResult)
                 res.render('pages/paylater', {
                    result : transformedResult,
                    message_success: req.flash('message_insert_paylater') || null,
                    user_id : user_id
                }) 
            } 
           
        })
        
    } catch (error) {
        console.log(error)
    }

})

module.exports = router;


