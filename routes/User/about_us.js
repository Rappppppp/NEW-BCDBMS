const express = require('express');
const router = express.Router();
const database = require('../../database')
const async = require("async")
const { checkAuthenticated } = require('../../middlewares/authentication')
const passport = require('passport')
router.use(passport.initialize())
router.use(passport.session())

router.get("/",
    checkAuthenticated,
    (req, res, next) => {
		async.parallel([
			(cb) => { database.query(`SELECT * FROM officials WHERE position ='Barangay Captain'`, cb) },
			(cb) => { database.query(`SELECT * FROM officials WHERE position !='Barangay Captain'`, cb) }
		], (err, data) => {
			if (err) throw err

			var brgy_captain = []
			var brgy_officials = []

			for (var k of data[0][0]) {
				var position = k.position
				var name = k.name
				var image = k.image
				brgy_captain.push({ position, name, image })
			}

			for (var j of data[1][0]) {
				var position = j.position
				var name = j.name
				var image = j.image
				brgy_officials.push({ position, name, image })
			}

            res.render('User/aboutus', {
                title: 'About us',
                fname: req.user.first_name,
                lname: req.user.last_name,
                brgy_captain: brgy_captain,
				officials: brgy_officials
            })
        })}
    
    )

router.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) return next(err)
        res.redirect('/')
    })
})

module.exports = router