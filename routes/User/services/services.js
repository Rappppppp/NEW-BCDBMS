const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../../../middlewares/authentication')
const passport = require('passport')
router.use(passport.initialize())
router.use(passport.session())

router.get("/",
  checkAuthenticated,
  (req, res, next) => {
    servicesDesc = `Barangay serves as the
  primary planning and implementing unit of government policies, plans,
  programs, projects, and
  activities in the community, and as a forum wherein the collective views of
  the people may be
  expressed, crystallized and considered, and where disputes may be amicably
  settled.`

    res.render('User/services/services', {
      title: 'Services',
      services: servicesDesc,
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