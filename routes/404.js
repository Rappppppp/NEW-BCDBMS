const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('.././middlewares/authentication')
const { authUser } = require('.././middlewares/authorization')
const passport = require('passport')
router.use(passport.initialize())
router.use(passport.session())
//authUser,
router.get("/", checkAuthenticated, (req, res, next) => {
    res.render('404')
})

module.exports = router