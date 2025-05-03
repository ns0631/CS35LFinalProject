var express = require('express');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
require('dotenv').config()

const { json } = require('body-parser');

var router = express.Router();

router.get('/', function(req, res){
    res.send("Hello World! This is the API, which will be for the frontend to communicate with the backend.");
});

//export this router to use in our index.js
module.exports = router;