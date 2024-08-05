const express = require('express');
const router = express.Router();
const con = require('../models/config/database');

router.post('/', function (req, res) {
    const id = req.body.product_id;
    const productPrice = req.body.productPrice
    const quantity = req.body.quantity
    const name = req.body.productName

    res.render('pages/edit_stock', {
        id: id,
        productPrice: productPrice,
        quantity:quantity,
        name:name
    })
});

module.exports = router;