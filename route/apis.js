const express = require('express')
const router = express.Router()
//引入套件
const userController = require('../controllers/api/userController')


//-------jwt登入------------------------------//
router.post('/users/logIn', userController.logIn)
module.exports = router