var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const UserModel = require('../models/users');


router.get('/', function(req, res, next) {
  res.redirect('users/login');
});

router.get('/login', (req,res,next) => {
  res.render('login', {hasTriedIn : req.session.hasTriedIn,
                      hasTriedUp: req.session.hasTriedUp});
})

router.route('/sign-up').post(async (req,res,next) => {

  const checkEmail = await UserModel.findOne({email: req.body.email});

  if (checkEmail) {
    console.log("email already in use");
    req.session.hasTriedUp = true;
    res.redirect('/users/login');
    return;
  }

  const newUser = new UserModel({
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    password : req.body.password,
  })

  const savedUser = await newUser.save();

  console.log("user added!");
  req.session.hasTriedUp = false;
  req.session.connectedId = savedUser._id;
  res.redirect('/');
})
.get((req,res,next) => {
  res.redirect('/users/login');
})

router.route('/sign-in').post( async (req,res,next) => {
  const check = await UserModel.findOne({email: req.body.email, password: req.body.password});

  if (check) {
    console.log("user connected!");
    req.session.connectedId = check._id;
    req.session.hasTriedIn = false;
    res.redirect('/');
  } else {
    console.log("wrong credentials or user not existing");
    req.session.hasTriedIn = true;
    res.redirect('/users/login');
  }
})
.get((req,res,next) => {
  res.redirect('/users/login');
})

module.exports = router;
