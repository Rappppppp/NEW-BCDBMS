const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../../middlewares/authentication')
const passport = require('passport')
router.use(passport.initialize())
router.use(passport.session())

router.get("/", checkAuthenticated, function (req, res, next) {
    res.render('User/aboutus', {
        title: 'About us',
        name: req.user.first_name
    })
})

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) return next(err)
        res.redirect('/')
    })
})

module.exports = router