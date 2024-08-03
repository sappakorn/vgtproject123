const express = require('express')
const router = express.Router()

router.post('/', function (req, res) {
    const itemIndex = parseInt(req.body.itemIndex);
    if (req.session.cartItems && Array.isArray(req.session.cartItems)) {
        // ตรวจสอบให้แน่ใจว่า index อยู่ในช่วงของอาเรย์
        if (itemIndex >= 0 && itemIndex < req.session.cartItems.length) {
            req.session.cartItems.splice(itemIndex, 1); // ลบรายการ เริ่มที่ตำแหน่ง itemIndex 1 ตำแหน่ง
        }
    }
    console.log(req.session.cartItems)
    res.redirect('/cart'); // กลับไปยังหน้าก่อนหน้า
})

module.exports = router;