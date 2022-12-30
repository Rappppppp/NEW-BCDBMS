const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const database = require('../database');

router.get("/", (req, res, next) => {
	res.render('register', {
		title: 'Register'
	});
})

router.post("/action", async (req, res) => { //checkNotAuthenticated
	var action = req.body.action
	const salt = await bcrypt.genSalt()
	const hashedPassword = await bcrypt.hash(req.body.password, salt)

	if (action == 'Add') {
		var id = req.body.id
		//* USER INFO WORKING
		var first_name = req.body.first_name
		var last_name = req.body.last_name
		var middle_name = req.body.middle_name
		var gender = req.body.gender
		var dob = req.body.dob
		var age = req.body.age
		var pob = req.body.pob
		var civil_status = req.body.civil_status
		var religion = req.body.religion

		// console.log(`
		// = USER INFO =
		// ID: 			${id}
		// FN:				${first_name}
		// LN:				${last_name}
		// MN:				${middle_name}
		// PW:				${hashedPassword}
		// GNDR:			${gender}
		// DOB:			${dob}
		// AGE:			${age}
		// POB:			${pob}
		// CVSTAT:			${civil_status}
		// RLGN:			${religion}
		// `)

		var user_info = `
		INSERT INTO user_info(
			id,
			isActive,
		 	role,
			first_name,
			last_name, 
			middle_name, 
			password, 
			gender, 
			age,
			dob, 
			pob, 
			civil_status, 
			religion
		) 
		VALUES (
			"${id}", 
			"1",
			"User", 
			"${first_name}", 
			"${last_name}", 
			"${middle_name}", 
			"${hashedPassword}", 
			"${gender}", 
			"${age}", 
			"${dob}", 
			"${pob}", 
			"${civil_status}", 
			"${religion}"
		)`

		//* CONTACT INFO
		var contact_number = req.body.contact_number
		var email_address = req.body.email_address
		var physical_address = req.body.physical_address
		var province = req.body.province
		var provincial_address = req.body.provincial_address

		var contact_info = `
		INSERT INTO contact_info(
			user_id,
			contact_number,
			email_address,
			physical_address,
			province,
			provincial_address
		)
		VALUES(
			"${id}",
			"${contact_number}",
			"${email_address}",
			"${physical_address}",
			"${province}",
			"${provincial_address}"
		)`

		console.log(contact_number)

		// //* MAKATI INFO
		var isVoter = req.body.isVoter
		var isHead = req.body.isHead
		var isVaccinated = req.body.vaccine
		var social_sector = req.body.social_sector
		var relationship = req.body.relationship
		var len_stay_makati = req.body.YearsofStay
		var len_stay_cembo = req.body.YearsinBrgy
		var len_stay_curr = req.body.YearsinCurrent

		var makati_info = `
		INSERT INTO makati_info(
			user_id,
			isVoter,
			isVaccinated,
			isHead,
			relationship,
			social_sector,
			len_stay_makati,
			len_stay_cembo,
			len_stay_curr
		)
		VALUES(
			"${id}",
			"${isVoter}",
			"${isVaccinated}",
			"${isHead}",
			"${relationship}",
			"${social_sector}",
			"${len_stay_makati}",
			"${len_stay_cembo}",
			"${len_stay_curr}"
		)`

		var household = req.body.Household
		var families_household = req.body.Families
		var family_members = req.body.FamilyMembers

		var household_info = `
		INSERT INTO household_info(
			user_id,
			head_id,
			household,
			families_household,
			family_members
		) 
		VALUES (
			"${id}",
			NULL,
			"${household}",
			"${families_household}",
			"${family_members}"
		)
		`

		//* MAKATI CARDS
		var yellow = req.body.yellow
		var blue = req.body.blue
		var white = req.body.white
		var makatizen = req.body.makatizen
		var philhealth = req.body.philhealth

		var makati_cards = `
		INSERT INTO makati_cards(
			user_id,
			yellow,
			blue,
			white,
			makatizen,
			philhealth
		)
		VALUES(
			"${id}",
			"${yellow}",
			"${blue}",
			"${white}",
			"${makatizen}",
			"${philhealth}"
		)`


		// //* INCOME INFO
		var educ = req.body.educ
		var monthly_income = req.body.inputMonthly
		var monthly_expenses = req.body.inputExpenses
		var monthly_netIncome = req.body.inputNetIncome
		var mean_income = req.body.mean_income

		var income_info = `
		INSERT INTO income_info(
			user_id,
			educ,
			monthly_income,
			monthly_expenses,
			monthly_netIncome,
			mean_income
		)
		VALUES(
			"${id}",
			"${educ}",
			"${monthly_income}",
			"${monthly_expenses}",
			"${monthly_netIncome}",
			"${mean_income}"
		)`

	}

	database.query(user_info)
	database.query(contact_info)
	database.query(makati_info)
	database.query(household_info)
	database.query(makati_cards)

	database.query(income_info, function (error, data) {
		res.json(
			{
				message: 'Registration Success'
			}
		)
	})
})

module.exports = router