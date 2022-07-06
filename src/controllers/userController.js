const userModel = require('../models/userModel')
const validator = require("email-validator")


const createUser = async function(req,res){
    try{
        let data = req.body

        if(Object.keys(data).length == 0){
            return res.status(400).send({
             status: false,
             msg : "Please provide the input"
            })
         }

        //Validation For Name
        if((typeof(data.name) != "string") || !data.name.match(/^[a-zA-Z ][a-zA-Z ]+[a-zA-Z ]+$/)) {
            return res.status(400).send({
                status: false,
                msg: "Intern Name is Missing or should contain only alphabets"
            })
        }
        
        //Validation for Title
        if (typeof (data.title) != "string") {
            return res.status(400).send({
                status: false,
                msg: "Title is Missing or does not have a valid input"
            })
        }
        //To handle enum condition
        else {
            if (data.title != "Mr" && data.title != "Mrs" && data.title != "Miss") {
                return res.status(400).send({
                    status: false,
                    msg: "Title can only be Mr Mrs or Miss"
                })
            }
        }
        //Validation for email
        if((typeof(data.email) != "string") || data.email.trim().length==0) {
            return res.status(400).send({
                status: false,
                msg: "Email is Missing"
            })
        }
        if (!validator.validate(data.email)) {
            return res.status(400).send({
                status: false,
                msg: "Email-Id is invalid"
            })
        }
        //Checks For Unique Email Id
        let checkEmail = await userModel.findOne({ email: data.email , isDeleted : false})
        if (checkEmail) {
            return res.status(400).send({
                status: false,
                msg: "Email Id already Registred"
            })
        }
           //Validation For Password
           if ((typeof (data.password) != "string")|| !data.password.
           match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/)) {
      return res.status(400).send({
          status: false,
          msg: "password must be 8-15 charecter long with a number special charecter and should have both upper and lowercase alphabet"
      })
        }

        //Validation for phone
        if((typeof(data.phone) != "string")){
            return  res.status(400).send({
                  status : false,
                  msg : "Phone Number is required"  
              })
          }
          if (!data.phone.match(/^[6-9]\d{9}$/)){
            return  res.status(400).send({
                  status : false,
                  msg : "Not a valid Phone Number"  
              })
          }
          let number =  await userModel.findOne({phone : data.phone})
          if(number){
              return res.status(400).send({
                  status: false,
                  msg: "Phone Number already Registred"
              }) 
          }

        if(data.address) { 
            if(typeof(data.address.city) != 'string'){
            return res.status(400).send({
                status: false,
                msg: "Please enter a valid city name"
            }) 
          }
          if(typeof(data.address.street) != 'string'){
            return res.status(400).send({
                status: false,
                msg: "Please enter a valid street name"
            }) 
          }
          if(typeof(data.address.pincode) != 'string' || !data.address.pincode.match(/^\d{6}$/)){
            return res.status(400).send({
                status: false,
                msg: "Please enter a valid pincode"
            })
          }
        }

        //Creating Autor Only if above validation are passed    
        let savedData = await userModel.create(data)
        res.status(201).send({
            status: true,
            data: savedData
        })
    }
    catch(err){
        console.log("Error is From Creating User :", err.message)
        res.status(500).send({
            status : false,
            msg : err.message
        })
    }
}



module.exports.createUser = createUser