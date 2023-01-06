const express = require('express')
const router = express.Router()
function authUser(req, res, next) {
    if (req.user == null) {
        res.redirect('/login')
    }
    next()
}

function authRole(role) {
    return (req, res, next) => {
        if(role.includes(req.user.role)){
            next()
        } 
        else {
            res.status(401)
            return res.redirect('/404')
        }
        // if (req.user.role !== role) {
        //     res.status(401)
        //     return res.redirect('/404')
        // }
        // next()
    }
}

module.exports = { authUser, authRole }