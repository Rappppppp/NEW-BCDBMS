const express = require('express')
const router = express.Router()
const database = require('../database')
const passport = require('passport')
const passport_init = require('../passport-config')
const { checkNotAuthenticated } = require('../middlewares/authentication')

router.use(passport.initialize())
router.use(passport.session())

router.get('/', checkNotAuthenticated, (req, res) => {
  loginQuery = `
  SELECT * FROM
  user_info AS ui JOIN
    contact_info AS ci
          ON ui.id = ci.user_id
  JOIN
    household_info AS hi
      ON ui.id = hi.user_id
  JOIN
    income_info AS ii
      ON ui.id = ii.user_id
  JOIN
    makati_info AS mi
      ON ui.id = mi.user_id
  JOIN
    makati_cards AS mc
      ON ui.id = mc.user_id;
  `
  
  database.query(loginQuery, (err, UsersData) => {
    passport_init(
      passport,
      name => UsersData.find(c => c.id === name),
      id => UsersData.find(c => c.id === id)
    )
  })
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