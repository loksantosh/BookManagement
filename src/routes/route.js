const express = require('express')
const router = express.Router()
const booksController = require('../controllers/booksController')



router.post('/books',booksController.createBooks)


module.exports=router;
