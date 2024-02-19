const jwt =require('jsonwebtoken')
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
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
        const id=preUser._id

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
                    , token,id })

                }
            });

        }

    }
    catch (error) {
        res.status(401).json(error)

    }
}

// for verify email
exports.Emailverify = async (req, res) => {
  const { email } = req.body

  if ( !email ) {

      res.status(401).json("all inputs are required")

  }
  try{
      const preUser = await users.findOne({email})

      if (!preUser) {
          return res.send({message:"User not existed"})
      }
      const uid=preUser._id

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env['USER'],
              pass: process.env['PASSWORD']
            }
          });

          var mailOptions = {
            from: 'OnlineTestapp.in <demo@g.com>',
            to: email,
            subject: 'Verify your email',
            text: `${process.env['FRONTEND_URL']}/updatepass/${uid}`
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
            return res.send({message:"Click the link on your mail for reset password"})
            }
          });

    }catch (error) {
        res.status(402).json(error)

    }

}

// for Update password
exports.updatePassword = async (req, res) => {
    const { psw,id } = req.body
    if ( !psw ) {

        res.status(401).json("all inputs are required")

    }
  await bcrypt.hash(psw, 10, async (err, hashedPassword) => {
    try{
        const preUser = await users.findOne({ _id:id })

        if (!preUser) {
            return res.send({message:"User not existed"})
        }else{
            preUser.psw=hashedPassword
            await preUser.save()

        res.status(200).json({message:"Password updated"})

        }


    }catch (error) {
        res.status(500).json(error)

    }
});
}