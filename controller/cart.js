const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
    let sum = 0;
    if (!req.session.cartItems || req.session.cartItems.length === 0) {
        res.render('pages/cart', {
            totalPrice: sum,
            cart_item: [] // ส่งอาร์เรย์ว่างไปยังหน้า cart เพื่อให้แสดงคำว่า "ว่าง"
        });
    } else {
        //คิดราคารวม
        req.session.cartItems.forEach(item => {
            count_p = item.count_product;
            totalprice = count_p * item.productPrice; 
            sum += totalprice;
        });
        res.render('pages/cart', {
            cart_item: req.session.cartItems,
            totalPrice: sum
        });
    }
})

module.exports = router;