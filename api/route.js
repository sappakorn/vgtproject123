const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();

const authRegisterRouter = require('./auth/register');
const authLoginRouter = require('./auth/login');

//route index
router.get('/',function(req,res){
    res.render('pages/index',{})
})


router.use('/auth/register', authRegisterRouter);

router.use('/auth/login', authLoginRouter);

module.exports = router;
