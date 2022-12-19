const express = require('express')
const router = express.Router()
function authUser(req, res, next) {
    if (req.user == null) {
        // return res.send('Sign in required.')
        res.redirect('/login')
    }
    next()
}

function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(401)
            return res.redirect('/404') //res.send('Not Allowed')
        }
        next()
    }
}

module.exports = { authUser, authRole }