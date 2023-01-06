const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../../middlewares/authentication')
const passport = require('passport')
router.use(passport.initialize())
router.use(passport.session())

router.get("/",
    checkAuthenticated,
    (req, res) => {
        res.render('User/forms', {
            title: 'Forms',
            fname: req.user.first_name,
            lname: req.user.last_name,
            mname: req.user.middle_name,
            address_curr: req.user.physical_address,
            address_prov: req.user.provincial_address,
            contact_number: req.user.contact_number,
            length_stay: req.user.len_stay_cembo,
            dob: req.user.dob,
            gender: req.user.gender,
            civil_status: req.user.civil_status
        })
    })

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) return next(err)
        res.redirect('/')
    })
})

module.exports = router