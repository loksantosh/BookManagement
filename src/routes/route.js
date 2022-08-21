const express = require('express');
const router = express.Router();
const {createUser,loginUser} = require('../controllers/userController')
const {createBooks,getBooks,getBooksById,updateBook,deleteBook} = require('../controllers/bookController')
const {createReview,updatereview,deletereview} = require('../controllers/reviewController')
const {authentication} = require('../middleware/auth')

// 1. ============= USER API'S ===================================================

router.post('/register', createUser)

router.post('/login',loginUser)

// 2. ============= BOOKS API'S ==================================================

router.post('/books',authentication,createBooks)

router.get('/books',authentication,getBooks)

router.get('/books/:bookId',authentication,getBooksById)

router.put('/books/:bookId',authentication,updateBook)

router.delete('/books/:bookId',authentication,deleteBook)


// 3. ================ REVIEW API'S ===============================================

router.post('/books/:bookId',createReview)

router.put('/books/:bookId/review/:reviewId',authentication,updatereview)

router.delete('/books/:bookId/review/:reviewId',authentication,deletereview)



// ================= BAD URL VALIDATION ============================================
router.all("*" , (req,res)=>{
    res.status(404).send({ msg:"NOT FOUND THIS URL"})
})


module.exports = router;


