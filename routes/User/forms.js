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
            lname: req.user.last_name
        })
    })

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) return next(err)
        res.redirect('/')
    })
})

module.exports = router