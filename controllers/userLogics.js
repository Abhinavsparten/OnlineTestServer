const jwt =require('jsonwebtoken')
const bcrypt = require("bcrypt");
users=require('../models/schema')


// for register
exports.userRegister = async (req, res) => {


    const { uname, email, psw } = req.body

    if (!uname || !email || !psw) {

        res.status(401).json("all inputs are required")

    }
    await bcrypt.hash(psw, 10, async (err, hashedPassword) => {
        try {
            const preUser = await users.findOne({ email })
            if (preUser) {
              return res.status(409).send({ message: "User already exists" });
            }
            else {
                const newUser = new users({
                    uname, email, psw: hashedPassword
                })

                await newUser.save()

              // Respond with a status code of 201
              res.status(200)
              .header('Content-Type', 'application/json').json({
                message:"Registration Successfull",newUser
              })
            }



        } catch (error) {

          res.status(500).send({ message: "Internal Server Error", error });
        }
    });

}

//for login

exports.userLogin = async (req, res) => {

    const { email, psw } = req.body
    if (!email || !psw) {

        res.status(401).json("all inputs are required")

    }

    try {
        const preUser = await users.findOne({ email })

        if (!preUser) {

            res.send({ message: "User not found" });
        }
        else {

            //token generation
            const token = jwt.sign(email, "secretkey123");

            //comparing passwords
            bcrypt.compare(psw, preUser.psw, async (err, result) => {

                if (!result) {
                     res.send({ message: "Incorrect Password" });
                }

                if (result) {

                    return res.status(200).send({ message: "login Successfull"
                    , token })

                }
            });

        }

    }
    catch (error) {
        res.status(401).json(error)

    }
}