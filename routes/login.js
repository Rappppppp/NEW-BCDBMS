const express = require('express')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')

const router = express.Router()
const database = require('../database')
const passport_init = require('../passport-config')
const { checkNotAuthenticated } = require('../middlewares/authentication')

router.use(passport.initialize())
router.use(passport.session())
router.use(flash())

database.query(`SELECT * FROM user_info`, (err, UsersData) => {
  passport_init(
    passport,
    name => UsersData.find(c => c.id === name),
    id => UsersData.find(c => c.id === id)
  )
})

router.get('/', checkNotAuthenticated, (req, res) => {
  req.flash()
  res.render('login', { title: 'Login' })
})

router.post('/', checkNotAuthenticated, passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }
))

module.exports = router;