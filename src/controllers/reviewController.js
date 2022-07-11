const mongoose = require('mongoose')
const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')



const createReview = async function(req,res){
   
     let bookId = req.params.bookId
    const alert = await bookModel.findOne({bookId})

    if(!alert) return res.status(404).send({ status: false, msg: "No Book found" })

    if(alert.isDeleted) return res.status(409).send({ status: false, msg: " Book is already deleted" })
    const reviewinc= await bookModel.findByIdAndUpdate((bookId),{$inc:{reviews : 1}})

    const {rating,review,reviewedBy,reviewedAt}=req.body
    const newdata={bookId,rating ,review ,reviewedBy,reviewedAt}
    const reviews = await reviewModel.create(newdata)


    const response={_id:reviews._id ,bookId:reviews.bookId,reviewedBy:reviews.reviewedBy,reviewedAt:reviews.reviewedAt ,rating:reviews.rating ,review:reviews.review}
    return res.status(201).send({ status: true, msg: response })
 
   
}


const updatereview = async (req, res) => {

   try {

        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        const isValid = mongoose.Types.ObjectId.isValid(bookId ,reviewId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })

        if (!bookId || !reviewId) return res.status(400).send({ status: false, messege: "bookId is required or bookId is required" })


        const alert = await bookModel.findOne({ _id: bookId })
        if (!alert) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert.isDeleted) return res.status(409).send({ status: false, messege: "this book is already deleted" })

        

        const alert2 = await reviewModel.findOne({ _id: reviewId })
        if (!alert2) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert2.isDeleted) return res.status(409).send({ status: false, messege: "this review is already deleted" })

        if(alert2.bookId != bookId)return res.status(400).send({ status: false, messege: "book and review doesn't match " })


        const data = req.body

        const { rating,review,reviewedBy,reviewedAt } = data

        


        const updatereview = await reviewModel.findOneAndUpdate((reviewId), { $set: { rating:rating, review: review,reviewedBy:reviewedBy,reviewedAt:Date.now()} }, { new: true })

        res.status(200).send({ status: true, messege: "Success", data:  updatereview })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

const deletereview = async (req, res) => {

    try {
     let date= Date.now()
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        const isValid = mongoose.Types.ObjectId.isValid(bookId ,reviewId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })

        if (!bookId || !reviewId) return res.status(400).send({ status: false, messege: "bookId is required or bookId is required" })


        const alert = await bookModel.findOne({ _id: bookId })
        if (!alert) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert.isDeleted) return res.status(409).send({ status: false, messege: "this book is already deleted" })

        

        const alert2 = await reviewModel.findOne({ _id: reviewId })
        if (!alert2) return res.status(404).send({ status: false, messege: "no data found " })

        if (alert2.isDeleted) return res.status(409).send({ status: false, messege: "this review is already deleted" })

        if(alert2.bookId != bookId)return res.status(400).send({ status: false, messege: "book and review doesn't match " })

        const reviewinc= await bookModel.findByIdAndUpdate((bookId),{$inc:{reviews : -1}})

        const deletereview = await reviewModel.findOneAndUpdate(({_id:reviewId}), { $set: { isDeleted: true, deletedAt: date } }, { new: true })
        res.status(200).send({ status: true, messege: "Success", data: deletereview })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports={createReview,updatereview ,deletereview}



