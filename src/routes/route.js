const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const riviewController = require('../controllers/reviewController')
const mw = require('../middleware/auth')

// 1. ============= USER API'S ===================================================

router.post('/register', userController.createUser)

router.post('/login',userController.loginUser)

// 2. ============= BOOKS API'S ==================================================

router.post('/books',bookController.createBooks)

router.get('/books',bookController.getBooks)

router.get('/books/:bookId',bookController.getBooksById)

router.put('/books/:bookId',mw.authentication,mw.authorization,bookController.updateBook)

router.delete('/books/:bookId',mw.authentication,mw.authorization,bookController.deleteBook)


// 3. ================ REVIEW API'S ===============================================

router.post('/books/:bookId',riviewController.createReview)

router.put('/books/:bookId/review/:reviewId',riviewController.updatereview)

router.delete('/books/:bookId/review/:reviewId',riviewController.deletereview)







//================= BAD URL VALIDATION ============================================
router.all("*" , (req,res)=>{
    res.status(404).send({ msg:"NOT FOUND THIS URL"})
})


module.exports = router;
