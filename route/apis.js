const express = require('express')
const router = express.Router()
//引入套件
const userController = require('../controllers/api/userController')
const passport = require('../config/passport')
//------------授權系統----------------
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

//-------jwt登入------------------------------//
router.post('/users/logIn', userController.logIn)
module.exports = router