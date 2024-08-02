const express = require('express');
const router = express.Router();
router.post('/', function (req, res) {
    
    const productId = req.body.increase_id;
    if (req.session.cartItems && Array.isArray(req.session.cartItems)) {
        // ค้นหาดัชนีของสินค้าที่ตรงกับ productId
        const itemIndex = req.session.cartItems.findIndex(item => item.product_id === productId);
        if (itemIndex !== -1) {
            // เช็คจำนวนสินค้าที่เหลือ
            const availableQuantity = req.session.cartItems[itemIndex].quantity;
            // ตรวจสอบว่าเกิน availableQuantity หรือไม่
            if (availableQuantity === 0) {
                // alert แจ้งเตือน 
                req.session.alertcart = 'outofstock'
                console.log( req.session.alertcart)
                res.redirect('/cart');
                return;
            }
            // เพิ่มจำนวน count_product และลด availableQuantity ถ้ามีสินค้าเหลืออยู่
            req.session.cartItems[itemIndex].count_product += 1;
            req.session.cartItems[itemIndex].quantity -= 1;
        }
    }
    console.log(req.session.cartItems);
    res.redirect('/cart');
})
module.exports = router;