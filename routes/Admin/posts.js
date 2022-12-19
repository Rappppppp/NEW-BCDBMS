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

// function authRole(role) {
//     return (req, res, next) => {
//         if (req.user.role !== role) {
//             res.status(401)
//             return res.send('Not Allowed')
//         }
//         next()
//     }
// }


router.get("/", authUser, checkAuthenticated, authRole('Admin'), (req, res, next) => {
    async.parallel([
        (cb) => { database.query(`SELECT * FROM posts`, cb) },
        (cb) => { database.query(`SELECT * FROM user_messages`, cb) }
    ], (err, data) => {
        if (err) throw err
        var arr_post = []
        var messages = []

        for (var i of data[0][0]) {
            id = i.id
            title = i.title
            body = i.body
            date = i.date
            time = i.time
            image = i.image
            arr_post.push({ id, title, body, date, time, image })
        }

        for (var i of data[1][0]) {
            email = i.email
            body = i.body
            date = i.date
            time = i.time
            messages.push({ email, body, date, time })
        }

        res.render('Admin/admin_posts', {
            title: 'Cembo Admin Posts',
            posts: arr_post,
            messages: messages
        })
    })

})

const limits = {
    files: 1,
    fileSize: 499999// <500kb
};

var upload = multer({ storage: multer.memoryStorage(), limits }) //, limits -add this inside array if needed

router.post('/upload', upload.single('image_post'), (req, res) => {

    //* UPLOAD POSTS START
    var title = req.body.title_post
    var body = req.body.body_post
    var date = req.body.date_post
    var time = req.body.time_post
    var image = req.file.buffer.toString('base64')

    // console.log(`${title}\n${body}\n${date}\n${time}`)

    var query_post = `INSERT INTO posts VALUES(NULL, "${title}", "${body}", "${date}", "${time}", "${image}")`

    database.query(query_post, function (error, data) {
        res.redirect('/adminposts')
    })

})
//* UPLOAD POSTS END

router.post('/deletemessage', (req, res, next) => {
    var action = req.body.action_delete

    if (action == 'deleteMessage') {
        deleteMessage = `DELETE FROM user_messages`
        database.query(deleteMessage, (err, data) => {
            res.redirect(req.get('referer'))
        })
    }
})

router.post('/editpost', upload.single('update-image'), (req, res) => {
    var action = req.body.action

    if (action == 'delete') {
        var id = req.body.id

        var query = `DELETE FROM posts  WHERE id ="${id}"`

        database.query(query, (error, data) => {
            res.json({
                message: 'Delete Success'
            })
        })
    }

    if (action == 'fetch_single') {
        var id = req.body.id
        var query = `SELECT * FROM posts WHERE id ="${id}"`
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
            UPDATE posts SET 
            title 	 = "${title}", 
            body 	 = "${body}",
            image 	 = "${update_image}"
            WHERE id = "${id}"
            `
            database.query(query, (error, data) => {
                res.json(
                    res.redirect('/adminposts')
                )
            })
        }
        else {
            var id = req.body.id
            var title = req.body.title_post
            var body = req.body.body_post

            var query = `
            UPDATE posts SET 
            title 	 = "${title}", 
            body 	 = "${body}"
            WHERE id = "${id}"
            `
            database.query(query, (error, data) => {
                res.json(
                    res.redirect('/adminposts')
                )
            })
        }

    }

})

module.exports = router