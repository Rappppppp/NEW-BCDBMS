const express = require('express')
const router = express.Router()
const database = require('../../database')
const async = require("async");
const { checkAuthenticated } = require('../../middlewares/authentication')
const passport = require('passport')
router.use(passport.initialize())
router.use(passport.session())

router.get("/",
	checkAuthenticated,
	(req, res, next) => {
		async.parallel([
			(cb) => { database.query(`SELECT * FROM posts`, cb) },
			(cb) => { database.query(`SELECT * FROM officials WHERE position ='Barangay Captain'`, cb) },
			(cb) => { database.query(`SELECT * FROM officials WHERE position !='Barangay Captain'`, cb) }
		], (err, data) => {
			if (err) throw err

			//higher[0][0] - RowDataPacket
			var arr_posts = []
			var brgy_captain = []
			var brgy_officials = []

			for (var i of data[0][0]) {
				title = i.title
				body = i.body
				author = i.author
				date = i.date
				time = i.time
				image = i.image

				arr_posts.push({ title, body, author, date, time, image })
			}

			for (var k of data[1][0]) {
				var position = k.position
				var name = k.name
				var image = k.image
				brgy_captain.push({ position, name, image })
			}

			for (var j of data[2][0]) {
				var position = j.position
				var name = j.name
				var image = j.image
				brgy_officials.push({ position, name, image })
			}

			res.render('User/homepage', {
				title: 'Homepage',
				fname: req.user.first_name,
				lname: req.user.last_name,
				posts: arr_posts,
				brgy_captain: brgy_captain,
				officials: brgy_officials
			})
		})
	})

router.post('/logout', function (req, res, next) {
	req.logout(function (err) {
		if (err) return next(err)
		res.redirect('/login')
	})
})

router.post("/sendmessage", function (req, res, next) {
	var action = req.body.action;

	if (action == 'SendMessage') {
		const name = `${req.user.first_name} ${req.user.last_name}`
		const message = req.body.message
		const date = req.body.date_message
		const time = req.body.time_message

		query = `INSERT INTO user_messages(id, name, body, date, time)
		VALUES(NULL, "${name}", "${message}", "${date}", "${time}")`

		database.query(query, () => {
			res.json({
				message: 'Message Sent!'
			})
		})
	}
})

module.exports = router