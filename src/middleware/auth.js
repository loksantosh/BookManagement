const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel')

//========================================= AUTHENTICATION ==============================================================

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key" || "X-Api-Key"]
        if (!token) {
            return res.status(400).send({ status: false, msg: "please send the token" })
        }

        let decodedToken = jwt.verify(token, "Group24-radon", function (error, token) {
            if (error) {
                return undefined
            } else {
                if(token.exp < (new Date().getTime() + 1) / 1000) return res.status(400).send({msg:"token expired"})

                return token
            }
        })

        if (decodedToken == undefined) {
            return res.status(401).send({ status: false, msg: "invalid token" })
        }

        req["decodedToken"] = decodedToken
        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//========================================= AUTHORIZATION ==============================================================


const authorization = async function (req, res, next) {
    try {
        let validUserId = req.decodedToken.userId
        let id = req.params.bookId


        if (id.length != 24) {
            return res.status(400).send({ status: false, msg: "please enter the book id or Please enter proper length of book Id" })
        }

        let checkBook = await bookModel.findById(id)

        if (!checkBook) {
            return res.status(404).send({ status: false, msg: "no such book exists" })
        }

        if (checkBook.userId !=validUserId) {
            return res.status(403).send({ status: false, msg: "User is not authorized" })
        }

        

        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}





module.exports = { authentication, authorization }