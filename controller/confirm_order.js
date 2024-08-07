const express = require('express')
const router = express.Router();


router.get('/', function (req, res) {
    const productlist = req.session.cart123 || [];
    const count_product = productlist.reduce((total, product) => total + product.quantity, 0);
    

     res.render('pages/confirm_order',{
        productlist:productlist,
        count_product:count_product

     }) 
});

module.exports = router;