var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const UserModel = require('../models/users');


router.get('/', function(req, res, next) {
  res.redirect('users/login');
});

router.get('/login', (req,res,next) => {
  res.render('login', {hasTriedIn : req.session.hasTriedIn,
                      hasTriedUp: req.session.hasTriedUp, isConnected: req.session.connectedId,name: req.session.name});
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
  req.session.hasTriedUp = false;
  req.session.connectedId = savedUser._id;
  req.session.name = savedUser.firstName;
  res.redirect('/');
})
.get((req,res,next) => {
  res.redirect('/users/login');
})

router.route('/sign-in').post( async (req,res,next) => {
  const check = await UserModel.findOne({email: req.body.email, password: req.body.password,name: req.session.name});

  if (check) {
    req.session.connectedId = check._id;
    req.session.hasTriedIn = false;
    req.session.name = check.firstName;
    res.redirect('/');
  } else {
    req.session.hasTriedIn = true;
    res.redirect('/users/login');
  }
})
.get((req,res,next) => {
  res.redirect('/users/login');
})


router.get('/last-trips', async (req,res,next) => {
  if (!req.session.connectedId) {
    res.redirect('/login');
    return;
  }
  const user = await UserModel.findById(req.session.connectedId).populate('bookings').exec();
  var date = [];
    for (let i=0; i<user.bookings.length;i++) {
    date.push(user.bookings[i].date.toLocaleDateString())
    }
  res.render('lasttrips',{bookings: user.bookings, date,isConnected: req.session.connectedId,name: req.session.name})
})

router.get('/disconnect', (req,res,next) => {
  req.session.connectedId = null;
  req.session.name = null;
  res.redirect('/');
})

module.exports = router;
