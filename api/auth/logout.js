const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    

    if(req.session.customer.key){
        console.log('logout success!');
        return res.render('pages/customer_login', { message_success : "ออกจากระบบสำเร็จ" });
    }
    if(req.session.user.id){
        console.log('logout success!');
        return res.render('pages/index1', { message_success : "ออกจากระบบสำเร็จ" });
    }
    
});

module.exports = router;
