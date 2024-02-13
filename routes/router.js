const express=require('express')
const { userRegister, userLogin } = require('../controllers/userLogics')
//create an object for router class in object
const router=new express.Router()


//route for register
router.post('/api/v1/register',userRegister)

//roote for login
router.post('/api/v1/login',userLogin)

module.exports=router