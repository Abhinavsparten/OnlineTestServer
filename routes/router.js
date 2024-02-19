const express=require('express')
const { marksAdd,getMarksAll} = require('../controllers/markLogics')
const { userRegister, userLogin } = require('../controllers/userLogics')
//create an object for router class in object
const router=new express.Router()



//route for register
router.post('/api/v1/register',userRegister)

//roote for login
router.post('/api/v1/login',userLogin)

//roote for login
router.post("/api/v1/add-marks", marksAdd);

//route for get all marks
router.get("/api/v1/get-marks/:uid", getMarksAll);

module.exports=router