const jwt =require('jsonwebtoken')

users=require('../models/schema')


// for register
exports.userRegister = async (req, res) => {


    const { uname, email, psw} = req.body

    if (!uname || !email || !psw ) {

        res.status(401).json("all inputs are required")

    }

    try {

        const preUser = await users.findOne({email})
        if (preUser) {
            res.send({message:"User already Exists"})
        }
        else {
            const newUser = new users({
                uname, email, psw
            })

            await newUser.save()

            res.status(200).send({message:"Registration Successfull"}).json(newUser)
        }

    }
    catch (error) {
        res.status(401).json(error)

    }

}

//for login

exports.userLogin = async (req, res) => {

    const { email, psw} = req.body


    if ( !email || !psw ) {

        res.status(401).json("all inputs are required")

    }

    try {
        const preUser = await users.findOne({email})

        if (preUser) {

            //token generation
            const token=jwt.sign(email,"secretkey123");
           if(psw === preUser.psw){

            res.send({message:"login Successfull",token})


           }
           else{
            res.send({message:"Incorrect Password"})
           }
        }
        else {
            res.send({message:"User not found"}) 

        }

    }
    catch (error) {
        res.status(401).json(error)

    }

}