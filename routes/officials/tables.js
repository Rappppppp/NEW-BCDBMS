const express = require('express')
const router = express.Router()
const database = require('../../database')
const async = require("async")

// Passport Middlewares
const { authRole, authUser } = require('../../middlewares/authorization')
const { checkAuthenticated } = require('../../middlewares/authentication')
const passport = require('passport')
router.use(passport.initialize())
router.use(passport.session())

router.get("/",
	authUser,
	checkAuthenticated,
	authRole(['Admin', 'Barangay Official']),
	(req, res, next) => {
		async.parallel([
			(cb) => {
				database.query(`SELECT * FROM user_messages`, cb)
			}
		],
			(err, data) => {
				if (err) throw err
				var messages = []

				for (var j of data[0][0]) {
					var name = j.name
					email = j.email
					body = j.body
					date = j.date
					time = j.time
					messages.push({ email, name, body, date, time })
				}

				res.render('officials/table', {
					title: 'Cembo Table Database',
					fname: req.user.first_name,
					messages: messages
				})
			})
	})

router.post('/deletemessage', (req, res, next) => {
	var action = req.body.action_delete

	if (action == 'deleteMessage') {
		deleteMessage = `DELETE FROM user_messages`
		database.query(deleteMessage, (err, data) => {
			res.redirect(req.get('referer'))
		})
	}
})

router.post("/action", (req, res, next) => {
	const table = "user_info"
	var action = req.body.action

	if (action == 'fetch') {
		var query = `SELECT * FROM user_info WHERE role!='Admin' AND role!='Barangay Official'`

		database.query(query, (error, data) => {
			res.json({
				data: data
			})
		})
	}

})

module.exports = router