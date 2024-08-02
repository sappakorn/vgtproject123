const express = require('express')
const route = express.Router();
const con = require('../models/config/database');

route.get('/', function (req, res) {
    
    const customer_name = req.session.customer.customer_name;
    console.log('Customer:' + req.session.customer.customer_id + " online")
    console.log('Customer_name :' + req.session.customer.customer_name)

    try {
        store_list = "select phone,user_id,name_shop,location_shop from usersprofile "
        con.query(store_list, function (error, result) {
            if (error) {
                return console.log("select error")
            }
            res.render('pages/customer_home', {
                list_store: result,
                customer_name: customer_name
            })
        });
    } catch (error) {
        return console.log("select error")
    }

});

module.exports = route;