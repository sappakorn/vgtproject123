const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    req.session = null;

    console.log('logout success!');
    return res.render('pages/index1', { message_success : "ออกจากระบบสำเร็จ" });
});

module.exports = router;
