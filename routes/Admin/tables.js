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
	authRole('Admin'),
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

				res.render('Admin/admin_table', {
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
		var query = `SELECT * FROM ${table} WHERE role!='Admin'`

		database.query(query, (error, data) => {
			res.json({
				data: data
			})
		})
	}

	if (action == 'Add') {
		var id = req.body.id
		var first_name = req.body.first_name
		var last_name = req.body.last_name
		var middle_name = req.body.middle_name
		var role = req.body.role
		var password = req.body.password
		var gender = req.body.gender
		var dob = req.body.dob
		var age = req.body.age
		var pob = req.body.pob
		var civil_status = req.body.civil_status
		var religion = req.body.religion

		console.log(dob)

		var query = `
		INSERT INTO ${table} (
			id,
			role,
			status,
			first_name, 
			last_name, 
			middle_name, 
			password, 
			gender, 
			dob, 
			age,
			pob, 
			civil_status, 
			religion
		) 
		VALUES (
			"${id}",
			"${role}",
			"1",
			"${first_name}", 
			"${last_name}", 
			"${middle_name}", 
			"${password}", 
			"${gender}", 
			"${dob}", 
			"${age}",
			"${pob}", 
			"${civil_status}", 
			"${religion}"
		)`

		database.query(query, (error, data) => {

			res.json({
				message: 'Data Added'
			})
		})
	}

	// EDIT FUNCTION
	if (action == 'fetch_single') {
		var id = req.body.id
		var query = `SELECT * FROM ${table} WHERE id ="${id}"`

		database.query(query, (error, data) => {

			res.json(data[0]);
		})
	}

	if (action == 'Edit') {
		var id = req.body.id
		var role = req.body.role
		var first_name = req.body.first_name
		var last_name = req.body.last_name
		var middle_name = req.body.middle_name
		var gender = req.body.gender
		var dob = req.body.dob
		var age = req.body.age
		var pob = req.body.pob
		var religion = req.body.religion
		var civil_status = req.body.civil_status
		var status = req.body.isActiveForm

		var query = `
		UPDATE ${table} SET 
		role = "${role}",
		isActive = "${status}",
		first_name = "${first_name}", 
		last_name = "${last_name}", 
		middle_name = "${middle_name}",
		gender = "${gender}",
		dob = "${dob}",
		age = "${age}",
		pob = "${pob}",
		religion = "${religion}",
		civil_status = "${civil_status}"
		WHERE id = "${id}"
		`

		console.log(role, first_name, middle_name, gender, dob, age, pob, religion, civil_status, id)
		console.log(query)

		database.query(query, (error, data) => {
			res.json({
				message: 'Data Edited'
			})
		})
	}

	if (action == 'delete') {
		var id = req.body.id

		var query = `
		DELETE ui, ci, hi, ii, mi, mc FROM
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
				ON ui.id = mc.user_id
		
		WHERE id="${id}";
		`
		console.log(query)
		database.query(query, () => {
			res.json({
				message: 'Data Deleted'
			})
		})
	}

	// Multiple Delete
	if (action == 'delete_id') {
		ids = req.body.data
		ParsedID = ids.substring(1, ids.length - 1)
		console.log(ParsedID)
		if (ParsedID === '') {
			res.json({
				message: 'No Data Acquired'
			})
		}
		else {
			query = `
			DELETE ui, ci, hi, ii, mi, mc FROM 
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
							ON ui.id = mc.user_id

					WHERE id IN (${ParsedID})`

			database.query(query, () => {
				res.json({
					message: 'Data Deleted'
				})
			})
		}
	}
})

module.exports = router