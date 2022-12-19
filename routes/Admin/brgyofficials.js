const express = require('express')
const router = express.Router()
const database = require('../../database')

// Photo Upload
const multer = require('multer')
const sharp = require('sharp')
const async = require("async")
const path = require('path')

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
            (cb) => { database.query(`SELECT * FROM officials`, cb) },
            (cb) => { database.query(`SELECT * FROM user_messages`, cb) }
        ], (err, data) => {
            if (err) throw err

            //higher[0][0] - RowDataPacket
            var higher_officials = []
            var messages = []

            for (var i of data[0][0]) {
                var id = i.id
                var position = i.position
                var name = i.name
                var image = i.image
                higher_officials.push({ id, position, name, image })
            }

            for (var j of data[1][0]) {
                email = j.email
                body = j.body
                date = j.date
                time = j.time
                messages.push({ email, body, date, time })
            }
            res.render('Admin/admin_officials', {
                title: 'Brgy. Officials',
                officials: higher_officials,
                messages: messages
            })
        })
    })

var upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname) // Gets the external name of uploaded file
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: {
        files: 1
    }
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

router.post('/editofficials',
    upload.single('official_profilepic'),
    async (req, res) => {
        var action = req.body.action

        if (action == "getID") {
            var query = `SELECT id FROM officials`
            database.query(query, (err, data) => {
                res.json(data);
            })
        }

        if (action == 'Add') {

            if (req.file) {
                var id = req.body.id
                var position = req.body.position_post
                var name = req.body.name_post
                // var image = req.file.buffer.toString('base64')
                var image = (
                    await sharp(req.file.buffer)
                        .resize(500, 500)
                        .withMetadata()
                        .toBuffer())
                    .toString('base64')

                var query = `
                    INSERT INTO officials (id, position, name, image) 
                    VALUES (
                        "${id}",
                        "${position}", 
                        "${name}",
                        "${image}"
                    )`
                database.query(query)
                res.redirect(req.get('referer'));
            }
            // Else if no pic still add
            else {
                var id = req.body.id
                var position = req.body.position_post
                var name = req.body.name_post
                var query = `
                    INSERT INTO officials (id, position, name) 
                    VALUES (
                        "${id}",
                        "${position}", 
                        "${name}"
                    )`
                database.query(query)
            }


            // if (req.file) {
            //     var id = req.body.id
            //     var position = req.body.position_post
            //     var name = req.body.name_post
            //     // var image = req.file.buffer.toString('base64')
            //     var image = (
            //         await sharp(req.file.buffer)
            //             .resize(500, 500)
            //             .withMetadata()
            //             .toBuffer())
            //         .toString('base64')

            //     var query = `
            //     INSERT INTO officials (id, position, name, image) 
            //     VALUES (
            //         "${id}",
            //         "${position}", 
            //         "${name}",
            //         "${image}"
            //     )`
            //     database.query(query)
            //     res.redirect(req.get('referer'));
            // }
            // // Else if no pic still add
            // else {
            //     var id = req.body.id
            //     var position = req.body.position_post
            //     var name = req.body.name_post
            //     var query = `
            //     INSERT INTO officials (id, position, name) 
            //     VALUES (
            //         "${id}",
            //         "${position}", 
            //         "${name}"
            //     )`
            //     database.query(query)
            // }
        }

        if (action == 'fetch_single') {
            var id = req.body.id
            var query = `SELECT * FROM officials WHERE id="${id}"`
            database.query(query, (err, data) => {
                res.json(data[0]);
            })
        }

        if (action == 'Edit') {
            if (req.file) {
                var id = req.body.id
                var position = req.body.position_post
                var name = req.body.name_post
                var image = req.file.buffer.toString('base64')

                var query = `
                UPDATE officials SET 
                position = "${position}",
                name 	 = "${name}",
                image    = "${image}"
                WHERE id = "${id}" 
                `
                database.query(query)
                res.redirect(req.get('referer'));
            }
            else {
                var id = req.body.id
                var position = req.body.position_post
                var name = req.body.name_post
                var query = `
                UPDATE officials SET 
                position = "${position}",
                name 	 = "${name}"
                WHERE id = "${id}"
                `
                database.query(query)
                res.redirect(req.get('referer'));
            }
        }

        if (action == 'delete_official') {
            var id = req.body.id
            database.query(`DELETE FROM officials WHERE id ="${id}"`, (err, data) => {
                if (err) {
                    res.json({
                        message: err
                    })
                }
                else {
                    res.json({
                        message: 'Data Deleted'
                    })
                }
            })
        }

        if (action == 'RemovePhoto') {
            var id = req.body.id
            database.query(`UPDATE officials SET image=NULL WHERE id ="${id}"`, (err, data) => {
                if (err) {
                    res.json({
                        message: err
                    })
                }
                else {
                    res.json({
                        message: 'Photo Deleted'
                    })
                }
            })
        }
    })

module.exports = router