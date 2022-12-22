const express = require('express')
const router = express.Router()
const database = require('../../database')
//const multer = require('multer')
const async = require("async")

// Passport Middlewares
const { authRole, authUser } = require('../../middlewares/authorization')
const { checkAuthenticated } = require('../../middlewares/authentication')
const passport = require('passport')
router.use(passport.initialize())
router.use(passport.session())

router.get("/", authUser, checkAuthenticated, authRole('Admin'), (req, res, next) => {
	async.parallel([
		(cb) => {
			database.query(`SELECT * FROM user_messages`, cb)
		}
	],
		(err, data) => {
			if (err) throw err
			var messages = []

			for (var j of data[0][0]) {
				email = j.email
				body = j.body
				date = j.date
				time = j.time
				messages.push({ email, body, date, time })
			}	// FILE LOC: routes/Admin/database

			res.render('Admin/admin_table', {
				title: 'Cembo Table Database',
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

router.post("/action", (request, response, next) => {
	const table = "user_info"
	var action = request.body.action

	if (action == 'fetch') {
		var query = `SELECT * FROM ${table} WHERE role!='Admin'`

		database.query(query, (error, data) => {
			response.json({
				data: data
			})
		})
	}

	if (action == 'Add') {
		var id = request.body.id
		var first_name = request.body.first_name
		var last_name = request.body.last_name
		var middle_name = request.body.middle_name
		var password = request.body.password
		var gender = request.body.gender
		var dob = request.body.dob
		var age = request.body.age
		var pob = request.body.pob
		var civil_status = request.body.civil_status
		var religion = request.body.religion

		console.log(dob)

		var query = `
		INSERT INTO ${table} (
			id,
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

			response.json({
				message: 'Data Added'
			})
		})
	}

	// EDIT FUNCTION
	if (action == 'fetch_single') {
		var id = request.body.id
		var query = `SELECT * FROM ${table} WHERE id ="${id}"`

		database.query(query, (error, data) => {

			response.json(data[0]);
		})
	}

	if (action == 'Edit') {
		var id = request.body.id
		var first_name = request.body.first_name
		var last_name = request.body.last_name
		var middle_name = request.body.middle_name
		var password = request.body.password
		var gender = request.body.gender
		var dob = request.body.dob
		var age = request.body.age
		var pob = request.body.pob
		var religion = request.body.religion
		var civil_status = request.body.civil_status

		var query = `
		UPDATE ${table} SET 
		first_name = "${first_name}", 
		last_name = "${last_name}", 
		middle_name = "${middle_name}",
		password = "${password}",
		gender = "${gender}",
		dob = "${dob}",
		age = "${age}",
		pob = "${pob}",
		religion = "${religion}",
		civil_status = "${civil_status}"
		WHERE id = "${id}"
		`

		database.query(query, (error, data) => {
			response.json({
				message: 'Data Edited'
			})
		})
	}

	if (action == 'delete') {
		var id = request.body.id
		var query = `DELETE FROM ${table} WHERE id="${id}"`

		//* IF THIS DOESN'T WORK: SET FOREIGN_KEY_CHECKS=0
		var tryquery = `
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
        
        WHERE id="${id}"
		`

		console.log(tryquery)

		database.query(tryquery, (error, data) => {
			response.json({
				message: 'Data Deleted'
			})
		})
	}

	// Multiple Delete
	if (action == 'delete_id') {
		ids = req.body.data
		ParsedID = ids.substring(1, ids.length - 1);

		console.log(ParsedID)
		if (ParsedID === '') {
			res.json({
				message: 'No Data Acquired'
			})
		}
		else {
			DELETE = `DELETE ui, ci, hi, ii, mi, mc FROM 
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

			database.query(DELETE, (error, data) => {
				res.json({
					message: 'Data Deleted'
				})
			})
		}
	}
})

module.exports = router