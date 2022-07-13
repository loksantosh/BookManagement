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

router.post('/books',mw.authentication,bookController.createBooks)

router.get('/books',mw.authentication,bookController.getBooks)

router.get('/books/:bookId',mw.authentication,bookController.getBooksById)

router.put('/books/:bookId',mw.authentication,mw.authorization,bookController.updateBook)

router.delete('/books/:bookId',mw.authentication,mw.authorization,bookController.deleteBook)


// 3. ================ REVIEW API'S ===============================================

router.post('/books/:bookId',reviewController.createReview)

router.put('/books/:bookId/review/:reviewId',mw.authentication,mw.authorization,reviewController.updatereview)

router.delete('/books/:bookId/review/:reviewId',mw.authentication,mw.authorization,reviewController.deletereview)



//================= BAD URL VALIDATION ============================================
router.all("*" , (req,res)=>{
    res.status(404).send({ msg:"NOT FOUND THIS URL"})
})


module.exports = router;
