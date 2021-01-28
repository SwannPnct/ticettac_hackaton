var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const UserModel = require('../models/users');


router.get('/', function(req, res, next) {
  res.redirect('users/login');
});

router.get('/login', (req,res,next) => {
  res.render('login', {});
})

router.post('/sign-up', async (req,res,next) => {

  const checkEmail = await UserModel.findOne({email: req.body.email});

  if (checkEmail) {
    console.log("email already in use");
    res.redirect('/users/login');
    return;
  }

  const newUser = new UserModel({
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    password : req.body.password,
  })

  await newUser.save();
  console.log("user added!");

  res.render('index',{});
})

router.post('/sign-in', async (req,res,next) => {
  const check = await UserModel.findOne({email: req.body.email, password: req.body.password});

  if (check) {
    console.log("user connected!");
    res.render('index', {})
  } else {
    console.log("wrong credentials or user not existing");
    res.redirect('/users/login');
  }
})

module.exports = router;
