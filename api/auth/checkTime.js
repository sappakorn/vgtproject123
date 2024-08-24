const express = require('express');
const router = express.Router();
const moment = require('moment'); // ใช้ moment แทน moment-timezone

router.get('/', (req, res) => {
    
    
    // ข้อมูลเวลาที่ได้รับ
    let transDate = '20240823'; // วันที่ที่ถูกต้อง
    let transTime = '18:40:27'; // เวลา
    // เวลาที่ทำธุรกรรมตามขอบเขตเวลาของ กรุงเทพ
    const transactionMoment = moment(`${transDate}T${transTime}`, 'YYYYMMDDTHH:mm:ss').tz('Asia/Bangkok');
    // เวลาปัจจุบัน กรุงเทพ
    const currentMoment = moment().tz('Asia/Bangkok');
    // เปรียบเทียบความแตกต่างเวลา
    const timeDifference = currentMoment.diff(transactionMoment, 'minutes');
    console.log('Time Difference (in minutes):', timeDifference);

    if (timeDifference <= 5) {
        res.send('ทำธุรกรรมในเวลา');
    } else {
        res.send('ทำธุรกรรมเกิน  เวลา ไป '+timeDifference+"นาที");
    }

     // ส่งข้อความตอบกลับ
});

module.exports = router;
