
const mongoose=require('mongoose')
const validator=require('validator')

const users=mongoose.model('User',{
    uname:{
        type:String,
        requierd:true,
        trim:true
    },

    email:{
        type:String,
        requierd:true,
        trim:true,
        validator(value){
            if(validator.isEmail(value)){
                throw Error("invalid Email")
            }
        }
    },

    psw:{
        type:String,
        requierd:true

    }


})



module.exports=users