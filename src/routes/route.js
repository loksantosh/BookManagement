const express = require('express');
const aws = require('aws-sdk')
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const reviewController = require('../controllers/reviewController')
const awsURL = require('../aws/aws')
const mw = require('../middleware/auth')

// 1. ============= USER API'S ===================================================

router.post('/register', userController.createUser)

router.post('/login',userController.loginUser)

// 2. ============= BOOKS API'S ==================================================

router.post('/books',mw.authentication,awsURL.aws1,bookController.createBooks)

router.get('/books',mw.authentication,bookController.getBooks)

router.get('/books/:bookId',mw.authentication,bookController.getBooksById)

router.put('/books/:bookId',mw.authentication,mw.authorization,bookController.updateBook)

router.delete('/books/:bookId',mw.authentication,mw.authorization,bookController.deleteBook)


// 3. ================ REVIEW API'S ===============================================

router.post('/books/:bookId',reviewController.createReview)

router.put('/books/:bookId/review/:reviewId',mw.authentication,mw.authorization,reviewController.updatereview)

router.delete('/books/:bookId/review/:reviewId',mw.authentication,mw.authorization,reviewController.deletereview)



//================= BAD URL VALIDATION ============================================
// router.all("*" , (req,res)=>{
//     res.status(404).send({ msg:"NOT FOUND THIS URL"})
// })

//====================================================== AWS =====================================================================

aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "abc/" + file.originalname, //HERE 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })

    // let data= await s3.upload( uploadParams)
    // if( data) return data.Location
    // else return "there is an error"

   })
}

router.post("/write-file-aws", async function(req, res){

    try{
        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
})

module.exports = router;
