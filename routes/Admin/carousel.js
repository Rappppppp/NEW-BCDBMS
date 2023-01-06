const express = require('express')
const router = express.Router()
const database = require('../../database')
const multer = require('multer')
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
        (cb) => { database.query(`SELECT * FROM carousel`, cb) },
        (cb) => { database.query(`SELECT * FROM user_messages`, cb) }
    ], (err, data) => {
        if (err) throw err
        var arr_post = []
        var messages = []

        for (var i of data[0][0]) {
            id = i.id
            title = i.title
            body = i.body
            author = i.author
            date = i.date
            time = i.time
            image = i.image
            arr_post.push({ id, title, body, author, date, time, image })
        }

        for (var j of data[1][0]) {
            var name = j.name
            email = j.email
            body = j.body
            date = j.date
            time = j.time
            messages.push({ email, name, body, date, time })
        }

        res.render('Admin/admin_carousel', {
            title: 'Cembo Admin Posts',
            posts: arr_post,
            fname: req.user.first_name,
            lname: req.user.last_name,
            messages: messages
        })
    })

})

const limits = {
    files: 1,
    fileSize: 499999// <500kb
};

var upload = multer({ storage: multer.memoryStorage(), limits }) //, limits -add this inside array if needed

router.post('/upload_carousel', upload.single('image_post'), (req, res) => {

    //* UPLOAD POSTS START
    var id = req.user.id
    var title = req.body.title_post
    var body = req.body.body_post
    var author = `Admin ${req.user.first_name} ${req.user.last_name}`
    var date = req.body.date_post
    var time = req.body.time_post
    var image = req.file.buffer.toString('base64')

    var query_post = `INSERT INTO carousel VALUES(NULL, "${id}", "${title}", "${body}", "${author}", "${date}", "${time}", "${image}")`
    console.log(query_post)
    database.query(query_post, () => {
        res.redirect('/admincarousel')
    })

})
//* UPLOAD POSTS END

router.post('/deletemessage', (req, res, next) => {
    var action = req.body.action_delete

    if (action == 'deleteMessage') {
        deleteMessage = `DELETE FROM user_messages`
        database.query(deleteMessage, () => {
            res.redirect(req.get('referer'))
        })
    }
})

router.post('/edit_carousel', upload.single('update-image'), (req, res) => {
    var action = req.body.action

    if (action == 'delete') {
        var id = req.body.id

        var query = `DELETE FROM carousel WHERE id ="${id}"`

        database.query(query, (error, data) => {
            res.json({
                message: 'Delete Success'
            })
        })
    }

    if (action == 'fetch_single') {
        var id = req.body.id
        var query = `SELECT * FROM carousel WHERE id ="${id}"`
        database.query(query, (error, data) => {
            res.json(data[0]);
        })
    }

    if (action == 'Edit') {

        if (req.file) {
            var id = req.body.id
            var title = req.body.title_post
            var body = req.body.body_post
            var update_image = req.file.buffer.toString('base64')

            var query = `
            UPDATE carousel SET 
            title 	 = "${title}", 
            body 	 = "${body}",
            image 	 = "${update_image}"
            WHERE id = "${id}"
            `
            database.query(query, (error, data) => {
                res.json(
                    res.redirect('/admincarousel')
                )
            })
        }
        else {
            var id = req.body.id
            var title = req.body.title_post
            var body = req.body.body_post

            var query = `
            UPDATE carousel SET 
            title 	 = "${title}", 
            body 	 = "${body}"
            WHERE id = "${id}"
            `
            database.query(query, (error, data) => {
                res.json(
                    res.redirect('/admincarousel')
                )
            })
        }

    }

})

module.exports = router