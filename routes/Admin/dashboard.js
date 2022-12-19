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

router.get("/", authUser, checkAuthenticated, authRole('Admin'), function (req, res, next) {
    async.parallel([
        (cb) => { database.query(`SELECT * FROM user_messages`, cb) }
    ], (err, data) => {
        if (err) throw err
        var messages = []

        for (var i of data[0][0]) {
            email = i.email
            body = i.body
            date = i.date
            time = i.time
            messages.push({ email, body, date, time })
        }

        res.render('Admin/admin_dashboard', {
            title: 'Cembo Admin Dashboard',
            messages: messages
        })
    })
})

router.post("/n_households", function (request, response, next) {

    var households = `SELECT household FROM household_info`;

    database.query(households, function (error, households) {

        response.json({
            data: households
        })
    })
})

router.post("/n_families", function (request, response, next) {

    var families = `SELECT families_household FROM household_info`;

    database.query(families, function (error, families) {

        response.json({
            data: families
        })
    })
})


router.post("/gender", function (request, response, next) {

    var gender = `SELECT gender FROM user_info`;

    database.query(gender, function (error, gender) {

        response.json({
            data: gender
        })
    })
})

router.post("/age", function (request, response, next) {

    var age = `SELECT age FROM user_info`;

    database.query(age, function (error, age) {
        response.json({
            data: age
        })
    })
})

router.post("/civil_status", function (request, response, next) {

    var status = `SELECT civil_status FROM user_info`;

    database.query(status, function (error, civil_status) {
        response.json({
            data: civil_status
        })
    })

})

router.post("/religion", function (request, response, next) {

    var religion = `SELECT religion FROM user_info`;

    database.query(religion, function (error, religion) {
        response.json({
            data: religion
        })
    })
})

router.post("/cards", function (request, response, next) {

    var cards = `SELECT * FROM makati_cards`;

    database.query(cards, function (error, cards) {
        response.json({
            data: cards
        })
    })
})


router.post("/social_sector", function (request, response, next) {

    var ss = `SELECT social_sector FROM makati_info`;

    database.query(ss, function (error, ss) {
        response.json({
            data: ss
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

router.post("/vaccine", function (request, response, next) {

    var vaccine = `SELECT isVaccinated FROM makati_info`;

    database.query(vaccine, function (error, vaccine) {
        response.json({
            data: vaccine
        })
    })
})

module.exports = router