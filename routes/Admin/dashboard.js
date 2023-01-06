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
            (cb) => { database.query(`SELECT * FROM user_messages`, cb) }
        ], (err, data) => {
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

            res.render('Admin/admin_dashboard', {
                title: 'Cembo Admin Dashboard',
                fname: req.user.first_name,
                messages: messages
            })
        })
    })

router.post("/n_households", function (req, res, next) {

    var households = `SELECT household FROM household_info`;

    database.query(households, function (error, households) {

        res.json({
            data: households
        })
    })
})

router.post("/n_families", function (req, res, next) {

    var families = `SELECT families_household FROM household_info`;

    database.query(families, function (error, families) {

        res.json({
            data: families
        })
    })
})


router.post("/gender", function (req, res, next) {

    var gender = `SELECT gender FROM user_info`;

    database.query(gender, function (error, gender) {

        res.json({
            data: gender
        })
    })
})

router.post("/age", function (req, res, next) {

    var age = `SELECT age FROM user_info`;

    database.query(age, function (error, age) {
        res.json({
            data: age
        })
    })
})

router.post("/civil_status", function (req, res, next) {

    var status = `SELECT civil_status FROM user_info`;

    database.query(status, function (error, civil_status) {
        res.json({
            data: civil_status
        })
    })

})

router.post("/religion", function (req, res, next) {

    var religion = `SELECT religion FROM user_info`;

    database.query(religion, function (error, religion) {
        res.json({
            data: religion
        })
    })
})

router.post("/cards", function (req, res, next) {

    var cards = `SELECT * FROM makati_cards`;

    database.query(cards, function (error, cards) {
        res.json({
            data: cards
        })
    })
})


router.post("/social_sector", function (req, res, next) {

    var ss = `SELECT social_sector FROM makati_info`;

    database.query(ss, function (error, ss) {
        res.json({
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

router.post("/vaccine", function (req, res, next) {

    var vaccine = `SELECT isVaccinated FROM makati_info`;

    database.query(vaccine, function (error, vaccine) {
        res.json({
            data: vaccine
        })
    })
})

module.exports = router