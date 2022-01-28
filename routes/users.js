const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const auth = require("../middleware/auth");
const temporaryBooking = require('../models/temporaryBooking');
const booking = require('../models/booking');


const User = require('../models/user');
let successMessage = false;

// Registration Form

router.get('/registration', (req, res) => {
    res.render('registration',{
        error:false,
        message:"",
        value:["","","","",""],
        usernameDuplicates: false
    });
});

router.post('/registration',
    check('passwordtwo').custom(async (confirmPassword, {req}) => {
        let password = req.body.passwordone;
        if(password !== confirmPassword){
            throw new Error('Passwords must be same');
        }
      }),
      async (req,res)=>{
        let error = false;
        let message = "";
        if (!validationResult(req).isEmpty()) {
            error=true;
            message = validationResult(req).errors[0].msg;
            res.render('registration',{
                error: error,
                message: message,
                value:[req.body.name, req.body.email, req.body.username, req.body.passwordone, req.body.passwordtwo],
                usernameDuplicates: false
            });
        }
        else {
            try{
                successMessage = true
                const salt = await bcrypt.genSalt(10);
                const newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: await bcrypt.hash(req.body.passwordone, salt)
            });
            newUser.save();
            res.redirect('/users/login');
            } catch(error){
                if (error.code===11000) res.render('registration',{
                    error:false,
                    message:"",
                    value:[req.body.name, req.body.email, req.body.username, req.body.passwordone, req.body.passwordtwo],
                    usernameDuplicates: true
                });
            }
        }
      });

// Login Form
router.get('/login', (req, res) => {
    res.render('login',{
        successMessage: successMessage,
        usernameDoesNotExists: false,
        passwordDoesNotExists: false,
        name: "",
        password: ""
    });
    successMessage = false;
});

// Login Process
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({username}).lean();
    if (!user) {
        res.render('login',{
            successMessage: false,
            usernameDoesNotExists: true,
            passwordDoesNotExists: false,
            name: req.body.username, 
            password: req.body.password
        });
    }
    else if (!await bcrypt.compare(password, user.password)){
        res.render('login', {
            successMessage: false,
            usernameDoesNotExists: false,
            passwordDoesNotExists: true,
            name: req.body.username,
            password: req.body.password
        });
    }
    else {
        const token = jwt.sign(
            { id: user._id, username: user.username },
            config.TOKEN_KEY
        );
        res.redirect('/');
    }
});

// Booking Form

router.get('/bookingForm', (req, res) => {
    res.render('bookingForm',{
        error:false,
        message:"",
        value:["","","","",""],
        usernameDuplicates: false
    });
});


router.post('/bookingForm',
    check('passwordtwo').custom(async (confirmPassword, {req}) => {
        let password = req.body.passwordone;
        if(password !== confirmPassword){
            throw new Error('Passwords must be same');
        }
      }),
      async (req,res)=>{
        let error = false;
        let message = "";
        if (!validationResult(req).isEmpty()) {
            error=true;
            message = validationResult(req).errors[0].msg;
            res.render('bookingForm',{
                error: error,
                message: message,
                value:[req.body.name, req.body.email, req.body.username, req.body.passwordone, req.body.passwordtwo],
                usernameDuplicates: false
            });
        }
        else {
            try{
                successMessage = true
                const salt = await bcrypt.genSalt(10);
                const newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: await bcrypt.hash(req.body.passwordone, salt)
            });
            newUser.save();

            temporaryBooking.find({}, async (err, temporaryBooking) => {
                const newBooking = await booking.create({
                    user: req.body.username,
                    room: temporaryBooking[0].room,
                    arrivalDate: temporaryBooking[0].possibleArrivalDate,
                    departureDate: temporaryBooking[0].possibleDepartureDate
                });
                newBooking.save();
            });

            
            res.redirect('/users/login');
            } catch(error){
                if (error.code===11000) res.render('bookingForm',{
                    error:false,
                    message:"",
                    value:[req.body.name, req.body.email, req.body.username, req.body.passwordone, req.body.passwordtwo],
                    usernameDuplicates: true
                });
            }
        }
      }
    );

module.exports = router;