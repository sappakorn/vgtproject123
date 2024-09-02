const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {

    if(req.session.user.user_id && req.session.user ){
        req.session = null;
        console.log('logout success!');
        return res.render('pages/index1', { message_success : "ออกจากระบบสำเร็จ" });
    }

    if(req.session.customer.customer_id && req.session.customer ){
        req.session = null;
        console.log('customer logout success!');
        return res.render('pages/customer_login', { message_success : "ออกจากระบบสำเร็จ" });
    }
    
});

module.exports = router;
