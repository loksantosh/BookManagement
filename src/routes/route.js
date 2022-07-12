const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const mw = require('../middleware/auth')

// 1. ============= USER API'S ===================================================

router.post('/register', userController.createUser)

router.post('/login',userController.loginUser)

// 2. ============= BOOKS API'S ==================================================

router.post('/books',bookController.createBooks)

router.get('/books',bookController.getBooks)

router.get('/books/:bookId',bookController.getBooksById)

router.put('/books/:bookId',bookController.updateBook)

router.delete('/books/:bookId',bookController.deleteBook)


// 3. ================ REVIEW API'S ===============================================

router.post('/books/:bookId',reviewController.createReview)

router.put('/books/:bookId/review/:reviewId',reviewController.updatereview)

router.delete('/books/:bookId/review/:reviewId',reviewController.deletereview)



//================= BAD URL VALIDATION ============================================
router.all("*" , (req,res)=>{
    res.status(404).send({ msg:"NOT FOUND THIS URL"})
})


module.exports = router;
