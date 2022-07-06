const booksModel = require('../models/booksModel')
// const usersModel = require()

const createBooks = async function (req, res) {
   try{
     let { title, excerpt, userId, ISBN, category, subcategory } = req.body;

    if (Object.keys(req.body).length == 0) {
        return res.status(400).send({ status: false, msg: "Please enter request data to be created" })
    }

    //title

    if (!title) {
        return res.status(400).send({ status: false, msg: "Please enter title" })
    }
    if (typeof title !== "string") return res.status(400).send({ status: false, msg: " Please enter  title as a String" });

    if (!/^\w[a-zA-Z.\_]*$/.test(title)) return res.status(400).send({ status: false, msg: "The  title may contain only letters" });

    let uniquetitle = await booksModel.findOne({ title: title })
    if (uniquetitle) {
        return res.status(400).send({ status: false, msg: "This title already exists" })
    }

    //excerpt 

    if (!excerpt) {
        return res.status(400).send({ status: false, msg: "Please enter excerpt" })
    }
    if (typeof excerpt !== "string") return res.status(400).send({ status: false, msg: " Please enter  excerpt as a String" });

    if (!/^\w[a-zA-Z.,\s]*$/.test(excerpt)) return res.status(400).send({ status: false, msg: "The  excerpt may contain only letters" });

    //userId

    if (!userId) {
        return res.status(400).send({ status: false, msg: "Please enter userId" })
    }

    if (userId.length !== 24) {
        return res.status(400).send({ status: false, msg: "Please enter proper length of user Id (24)" })
    }

    let validUser = await usersModel.findById(userId)
    if (!validUser) {
        return res.status(400).send({ status: false, msg: "Please enter the valid userId" })
    }

    //ISBN

    if (!ISBN) {
        return res.status(400).send({ status: false, msg: "Please enter ISBN" })
    }

    if (!/^(\+\d{1,3}[- ]?)?\d{17}$/.test(ISBN)) return res.status(400).send({ status: false, msg: " please enter valid ISBN Number" });

    // if(ISBN.length !== 17){
    //     return res.status(400).send({status:false,msg:"Please enter proper length of ISBN (24)"})
    // }

    let uniqueISBN = await booksModel.findOne({ ISBN: ISBN })
    if (uniqueISBN) {
        return res.status(400).send({ status: false, msg: "This ISBN number already exists" })
    }

    //category

    if (!category) {
        return res.status(400).send({ status: false, msg: "Please enter category" })
    }

    if (typeof category !== "string") return res.status(400).send({ status: false, msg: " Please enter  category as a String" });

    if (!/^\w[a-zA-Z.,\s]*$/.test(category)) return res.status(400).send({ status: false, msg: "The  category may contain only letters" });

    //subcategory

    if (!subcategory) {
        return res.status(400).send({ status: false, msg: "Please enter subcategory" })
    }

    if (!/^\w[a-zA-Z.,\s]*$/.test(subcategory)) return res.status(400).send({ status: false, msg: "The  subcategory may contain only letters" });

    let saveData = await booksModel.create(req.body)
    return res.status(201).send({ status: true, data: saveData, msg: "Your book has been created successfully" })

}catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
}

}

module.exports.createBooks=createBooks