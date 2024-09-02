const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const user_id = req.session.user.user_id;
    // select ...,....,.... from userssprofile where user_id = ? //[user_id]
    res.render('pages/update_store',{
        user_id:user_id
    })
    
});

module.exports = router;
