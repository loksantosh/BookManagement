const express = require('express');
const multer =  require('multer')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes/route.js');
const app = express();
const { AppConfig } = require('aws-sdk')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer().any())


mongoose.connect("mongodb+srv://dhirajpatil:XuEAzywgRheQB7B1@cluster0.0v32f.mongodb.net/group24Database?retryWrites=true&w=majority"
    , { useNewUrlParser: true })
    .then(() => console.log('MongoDB is connected'))
    .catch(err => console.log(err));



app.use('/', route);
app.listen(process.env.PORT || 3000, function () {
    console.log('express app running on PORT ' + (process.env.PORT || 3000))
});