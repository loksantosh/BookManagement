const mongoose = require('mongoose')
const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')

// 3. API ==================================== CREATE BOOKS ==========================================================
const createBooks = async function (req, res) {
    try {
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body;

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, messege: "Please enter request data to be created" })
        }

        //title

        if (!title) {
            return res.status(400).send({ status: false, messege: "Please enter title" })
        }
        if (typeof title !== "string") return res.status(400).send({ status: false, messege: " Please enter  title as a String" });

        if (!/^\w[a-zA-Z.\s_]*$/.test(title)) return res.status(400).send({ status: false, messege: "The  title may contain only letters" });

        let uniquetitle = await bookModel.findOne({ title: title })
        if (uniquetitle) {
            return res.status(400).send({ status: false, messege: "This title already exists" })
        }

        //excerpt 

        if (!excerpt) {
            return res.status(400).send({ status: false, messege: "Please enter excerpt" })
        }
        if (typeof excerpt !== "string") return res.status(400).send({ status: false, messege: " Please enter  excerpt as a String" });

        if (!/^\w[a-zA-Z.,\s]*$/.test(excerpt)) return res.status(400).send({ status: false, messege: "The  excerpt may contain only letters" });

        //userId

        if (!userId) {
            return res.status(400).send({ status: false, messege: "Please enter userId" })
        }

        if (userId.length !== 24) {
            return res.status(400).send({ status: false, messege: "Please enter proper length of user Id (24)" })
        }

       const checkUser =await userModel.findById(userId)
       if(!checkUser) return res.status(404).send({ status: false, messege: "User not found" })
        //ISBN

        if (!ISBN) {
            return res.status(400).send({ status: false, messege: "Please enter ISBN" })
        }
       
       if(!(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))) return res.status(400).send({ status: false, messege: " ISBN is invalid" })

        let uniqueISBN = await bookModel.findOne({ ISBN: ISBN })
        if (uniqueISBN) {
            return res.status(400).send({ status: false, messege: "This ISBN number already exists" })
        }

        //category

        if (!category) {
            return res.status(400).send({ status: false, messege: "Please enter category" })
        }

        if (typeof category !== "string") return res.status(400).send({ status: false, messege: " Please enter  category as a String" });

        if (!/^\w[a-zA-Z.,\s]*$/.test(category)) return res.status(400).send({ status: false, messege: "The  category may contain only letters" });

        //subcategory

        if (!subcategory) {
            return res.status(400).send({ status: false, messege: "Please enter subcategory" })
        }

        if (!/^\w[a-zA-Z.,\s]*$/.test(subcategory)) return res.status(400).send({ status: false, messege: "The  subcategory may contain only letters" });

        //releasedAt 

        if (!releasedAt) {
            return res.status(400).send({ status: false, messege: "Please enter releasedAt" })
        }
        if (!/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) return res.status(400).send({ status: false, messege: "releasedAt should be valid" })

        if(typeof subcategory=='array')
        subcategory=subcategory.join('') 

        let saveData = await bookModel.create(req.body)
        return res.status(201).send({ status: true, messege: "Your book has been created successfully", data: saveData, })

    } catch (err) {
        return res.status(500).send({ status: false, messege: err.message })
    }

}

// 4. API ==================================== GET BOOKS ==========================================================


const getBooks = async function (req, res) {

    try {

        let data = req.query

        if (data.userId) {
            if (!mongoose.isValidObjectId(data.userId)) {
                return res.status(400).send({ status: false, messege: "Please enter userID as a valid ObjectId" })
            }
        }

        if (data) {
            const bookDetails = await bookModel.find({ $and: [data, { isDeleted: false }] }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({title :1})
            if (bookDetails.length == 0) return res.status(404).send({ status: false, messege: "No Book found" })

            return res.status(200).send({ status: true, messege: 'Books list', data: bookDetails })

        } else {
            const bookDetails = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({title :1})
            return res.status(200).send({ status: true, messege: 'Books list', data: bookDetails })
        }

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}

// 5. API ==================================== GET BOOKS BY ID ==========================================================


const getBooksById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let date=new Date

        if (bookId) {
            if (!mongoose.isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, messege: "Please enter userID as a valid ObjectId" })
            }
        }

        let bookDetail = await bookModel.findById({ _id: bookId, isDeleted: false });

        if (!bookDetail)
            return res.status(404).send({ status: false, messege: "Book not found!" });

        let reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }, { _id: 1, bookId: 1, reviewedBy: 1, rating: 1, review: 1, releasedAt: 1 });
         const newData={_id:bookDetail._id ,title:bookDetail.title ,excerpt:bookDetail.excerpt ,userId:bookDetail.userId ,category:bookDetail.category ,subcategory:bookDetail.subcategory ,isDeleted:bookDetail.isDeleted ,reviews:bookDetail.reviews ,releasedAt:bookDetail.releasedAt ,createdAt: date ,updatedAt: date ,reviewsData :reviewsData}
         
        return res.status(200).send({ status: true, messege: "Book List :-", data: newData });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// 6. API ==================================== UPDATE BOOK ==========================================================

const updateBook = async (req, res) => {

    try {

        const bookId = req.params.bookId
        const isValid = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValid) return res.status(400).send({ status: false, messege: "enter valid objectID" })

        if (!bookId) return res.status(400).send({ status: false, messege: "bookId is required" })


        const alert = await bookModel.findById( bookId )
        if (!alert) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert.isDeleted) return res.status(409).send({ status: false, messege: "this book is already deleted" })

        const data = req.body

        const { title, excerpt, releasedate, ISBN,subcategory } = data

        const checktitle = await bookModel.findOne({title:title})
        if(checktitle )return res.status(409).send({ status: false, messege: "this book title is already exist" })

        const checkISBN = await bookModel.findOne({ISBN:ISBN})
        if(checkISBN )return res.status(409).send({ status: false, messege: "this book ISBN is already exist" })



        const updateBook = await bookModel.findByIdAndUpdate((bookId), { $set: { title: title, excerpt: excerpt, releasedate:releasedate,ISBN:ISBN } ,$push:{subcategory:subcategory}}, { new: true })

        res.status(200).send({ status: true, messege: "Success", data: updateBook })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


// 7. API ==================================== DELETE BOOK ==========================================================

const deleteBook = async (req, res) => {

    try {
let date= Date.now()
        const bookId = req.params.bookId
        
        const isValid = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValid) return res.status(400).send({ status: false, messege: "enter valid objectID" })

        if (!bookId) return res.status(400).send({ status: false, messege: "bookId is required" })

        const alert = await bookModel.findById( bookId )
        if (!alert) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert.isDeleted) return res.status(409).send({ status: false, messege: "this book is already deleted" })
        const deletereviews= await reviewModel.updateMany({bookId:bookId},{ $set: { isDeleted: true ,} })

        const deleteBook = await bookModel.findByIdAndUpdate((bookId), { $set: { isDeleted: true, deletedAt: date ,reviews:0} }, { new: true })
        res.status(200).send({ status: true, messege: "Success", data: deleteBook })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}





module.exports={createBooks,getBooks,getBooksById,deleteBook,updateBook}
