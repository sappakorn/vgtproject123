const express = require('express');
const router = express.Router();


router.post('/', function (req, res) {
    const productId = req.body.decrease_id;
    if (req.session.cartItems && Array.isArray(req.session.cartItems)) {
        // หารายการที่มี product_id ตรงกับที่ส่งมา               ฟังก์ชัน callback       
        const itemIndex = req.session.cartItems.findIndex(item => item.product_id === productId);
        if (itemIndex !== -1) {
            //ลบหนึงทุกครั้งที่ count_product มากกว่า 0
            if (req.session.cartItems[itemIndex].count_product > 0) {
                req.session.cartItems[itemIndex].count_product -= 1;
                req.session.cartItems[itemIndex].quantity += 1;
                // count_product เหลือ 0 เอารายการออก
                if (req.session.cartItems[itemIndex].count_product === 0) {
                    req.session.cartItems.splice(itemIndex, 1);
                }
            }
        }
    }
    console.log(req.session.cartItems);
    res.redirect('/cart');
})

module.exports = router;