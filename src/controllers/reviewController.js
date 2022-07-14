const mongoose = require('mongoose')
const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')

// 8. API =========================================== CREATE REVIEW =========================================================

const createReview = async function (req, res) {
    try {

        let bookId = req.params.bookId

        const isValid = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid bookID" })

        const reviewinc = await bookModel.findByIdAndUpdate((bookId), { $inc: { reviews: 1 } })
        const alert = await bookModel.findById(bookId).select({ createdAt: 0, updatedAt: 0 ,deletedAt:0})
        

        if (!alert) return res.status(404).send({ status: false, msg: "No Book found" })

        if (alert.isDeleted) return res.status(409).send({ status: false, msg: " Book is already deleted" })
      
        let data=req.body
        const { rating, review, reviewedBy } =data
        if(!rating) return res.status(400).send({status:false ,messege:"rating is required"})

        if (typeof (data.rating) != 'number' || (data.rating > 5 || data.rating < 1)) {
            return res.status(400).send({
              status: false,
              message: "Please input rating between 1-5 only"
            })
        }

      
        if(!review) return res.status(400).send({status:false ,messege:"review is required"})
        if(review.trim().length==0) return res.status(400).send({status:false ,messege:"review is required"})


        let date = Date.now()
      let reviewedAt = date
        const newdata = { bookId, rating, review, reviewedBy, reviewedAt }
        const reviews = await reviewModel.create(newdata)


        const response = { alert, _id: reviews._id, bookId: reviews.bookId, reviewedBy: reviews.reviewedBy, reviewedAt: reviews.reviewedAt, rating: reviews.rating, review: (reviews.review) }
        return res.status(201).send({ status: true, msg: response })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })

    }
}

// 9. API ========================================= UPDATE REVIEW ===========================================================

const updatereview = async function (req, res)  {

    try {

        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        const isValid = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid bookID" })

        if (!bookId ) return res.status(400).send({ status: false, messege: "bookId is required  " })

        const isValid1 = mongoose.Types.ObjectId.isValid( reviewId)
        if (!isValid1) return res.status(400).send({ status: false, msg: "enter valid rejectID" })

        if (!reviewId) return res.status(400).send({ status: false, messege: " reviewId is required" })


        const alert = await bookModel.findById(bookId).select({ createdAt: 0, updatedAt: 0,deletedAt:0 })

        if (!alert) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert.isDeleted) return res.status(409).send({ status: false, messege: "this book is already deleted" })


        const alert2 = await reviewModel.findById(reviewId)
        if (!alert2) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert2.isDeleted) return res.status(409).send({ status: false, messege: "this review is already deleted" })

        if (alert2.bookId != reviewId) return res.status(400).send({ status: false, messege: "book and review doesn't match " })


        const data = req.body

        const { rating, review, reviewedBy } = data


        const updatereview = await reviewModel.findByIdAndUpdate((reviewId), { $set: { rating: rating, review: review, reviewedBy:reviewedBy, reviewedAt: Date.now() } }, { new: true })

        res.status(200).send({ status: true, messege: "Success", data: { alert, updatereview } })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}

// 10. API ========================================= DELETE REVIEW ===========================================================


const deletereview = async (req, res) => {

    try {
        let date = Date.now()
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        const isValid = mongoose.Types.ObjectId.isValid(bookId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid bookID" })
        if (!bookId ) return res.status(400).send({ status: false, messege: "bookId is required  " })


        const isValid1 = mongoose.Types.ObjectId.isValid( reviewId)
        if (!isValid1) return res.status(400).send({ status: false, msg: "enter valid reviewID" })
        if (!reviewId) return res.status(400).send({ status: false, messege: " reviewId is required" })



        const alert = await bookModel.findById({ _id: bookId }).select({ createdAt: 0, updatedAt: 0 })
        if (!alert) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert.isDeleted) return res.status(409).send({ status: false, messege: "this book is already deleted" })



        const alert2 = await reviewModel.findById({ _id: reviewId })
        if (!alert2) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert2.isDeleted) return res.status(409).send({ status: false, messege: "this review is already deleted" })

        if (alert2.bookId != reviewId) return res.status(400).send({ status: false, messege: "book and review doesn't match " })

        const reviewinc = await bookModel.findByIdAndUpdate((bookId), { $inc: { reviews: -1 } })

        const deletereview = await reviewModel.findByIdAndUpdate(({ _id: reviewId }), { $set: { isDeleted: true, deletedAt: date } }, { new: true })
        res.status(200).send({ status: true, messege: "Success", data: { alert, deletereview } })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createReview, updatereview, deletereview }



