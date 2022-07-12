const userModel = require('../models/userModel')
const validator = require('email-validator')
const jwt = require('jsonwebtoken')



// 1. API ========================================== CREATE USER ===============================================

const createUser = async function (req, res) {
    try {
        let data = req.body
        let { name, title, email, phone, password, address } = data

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please enter request data to be created" })
        }
        //title
        if (!title) {
            return res.status(400).send({ status: false, msg: "Please enter title" })
        }
        if (!(title == "Mrs" || title == "Mr" || title == "Miss")) {
            return res.status(401).send({ error: "title has to be Mr or Mrs or Miss " })
        }

        //name


        if (!name) {
            return res.status(400).send({ status: false, msg: "Please enter name" })
        }
        if (typeof name != "string" || name.trim().length==0) return res.status(400).send({ status: false, msg: " Please enter  name as a String" });

        if (!(/^\w[a-zA-Z.\s_]*$/.test(name))) return res.status(400).send({ status: false, msg: "The  name may contain only letters" });

        //phone
        if (!phone) {
            return res.status(400).send({ status: false, msg: "phone is missing" })
        }

        if (typeof phone !== "string") return res.status(400).send({ status: false, msg: " Please enter  phone as a String" });

        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)) return res.status(400).send({ status: false, msg: "Please enter a valid Indian phone number" });

        let uniquephone = await userModel.findOne({ phone: phone })
        if (uniquephone) {
            return res.status(400).send({ status: false, msg: "This phone number already exists" })
        }

        //email
        if (!email) {
            return res.status(400).send({ status: false, msg: "email is missing" })
        }

        let checkEmail = validator.validate(email)
        if (!checkEmail) {
            return res.status(400).send({ status: false, msg: "please enter email in valid format " })
        }

        let uniqueEmail = await userModel.findOne({ email })
        if (uniqueEmail) {
            return res.status(400).send({ status: false, msg: "This email already exists" })
        }

        

        //password
        if (!password) {
            return res.status(400).send({ status: false, msg: "password is missing" })
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password))
            return res.status(400).send({ status: false, msg: "password must be 8-15 charecter long with a number special charecter and should have both upper and lowercase alphabet" });

        //address

        if (!/^\w[a-zA-Z.,\s]*$/.test(address.city)) return res.status(400).send({ status: false, msg: "The  city may contain only letters" });


        if (!/^\d{6}$/.test(address.pincode)) return res.status(400).send({ status: false, msg: "Please enter valid Pincode" });

        let saveData = await userModel.create(data)
        return res.status(201).send({ status: true, msg: "Your user has been created successfully", data: saveData, })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

// 2 API =================================================== LOGIN USER ======================================== 

const loginUser = async function (req, res) {
    try {

        let { email, password } = req.body

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "please enter data in request body" })
        }

        if (!email) {
            return res.status(400).send({ status: false, msg: "please enter email" })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "please enter password " })
        }

        let user = await userModel.findOne({ email: email, password: password });
        if (!user) {
            return res.status(404).send({ status: false, msg: "no data found " })
        }

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                batch: "radon",
                organisation: "functionUp"
            },
            "Group24-radon",
            { expiresIn: "3600s" }
        )

        res.setHeader("x-api-key", token)

        return res.status(200).send({ status: true, msg: "user are login successfully", data: token })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}


module.exports ={ createUser ,loginUser}















