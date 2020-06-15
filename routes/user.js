const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { otp, sendWelcomeEmail } = require('../config/account');
let otpValue;

//login
router.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/notes');
  }
  res.render('user/login');
});

//register
router.get('/register', (req, res) => {
  if (req.user) {
    return res.redirect('/notes');
  }
  res.render('user/register');
});

//forgot password
router.get('/forgot', (req, res) => {
  res.render('user/forgot');
});

//change password
router.get('/passwordChange', (req, res) => {
  res.render('user/passwordChange');
});

//register post
router.post('/register', async (req, res) => {
  try {
    let errors = [];
    if (!req.body.username) {
      errors.push({ text: 'Username required' });
    }
    if (req.body.password !== req.body.cpassword) {
      errors.push({ text: 'Password do not match' });
    }
    if (req.body.password.length <= 5 || req.body.cpassword.length <= 5) {
      errors.push({ text: 'Password cant be short than 6' });
    }

    if (errors.length > 0) {
      return res.render('user/register', {
        errors,
        username: req.body.username,
        email: req.body.email,
      });
    }
    const email = req.body.email;
    const checkMail = await User.findOne({ email });

    if (checkMail) {
      errors.push({ text: 'Email Already Taken' });
      return res.render('user/register', {
        errors,
        username: req.body.username,
      });
    }

    const newData = new User({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      cpassword: req.body.cpassword,
    });

    await newData.save();
    req.flash('success_msg', 'User Added!');
    res.redirect('/user');
  } catch (error) {
    console.log('error in register', e);
  }
});

//login post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/user',
    failureFlash: true,
  })(req, res, next);
});

//forgot password
router.post('/forgot', async (req, res) => {
  try {
    let errors = [];
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      errors.push({ text: 'Email Not Exist Please Register First' });
      return res.render('user/register', {
        errors,
      });
    }

    const otp = sendWelcomeEmail(user.email, user.username);
    otpValue = otp;
    res.render('user/otpVerify', {
      otp,
      email: user.email,
    });
  } catch (error) {}
});

//otp verify
router.post('/otpverify', (req, res) => {
  const value = req.body.otp;
  const email = req.body.email;

  if (value !== otpValue) {
    req.flash('error_msg', 'Otp Was Incorrect Please Try Again');
    return res.redirect('/user');
  }
  res.render('user/passwordChange', {
    value,
    email,
  });
});

//password change form
router.put('/passwordChange', async (req, res) => {
  try {
    const email = req.body.email;
    let errors = [];

    if (req.body.password !== req.body.cpassword) {
      errors.push({ text: 'Password do not match' });
    }
    if (req.body.password.length <= 5 || req.body.cpassword.length <= 5) {
      errors.push({ text: 'Password cant be short than 6' });
    }

    if (errors.length > 0) {
      return res.render('user/passwordChange', {
        errors,
        email,
      });
    }

    const updatedUser = await User.findOne({ email });
    (updatedUser.password = await bcrypt.hash(req.body.password, 10)),
      await updatedUser.save();
    req.flash('success_msg', 'Password Changed!');
    res.redirect('/user');
  } catch (error) {}
});

//logout form
router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash({ text: 'User Logged Out' });
  res.redirect('/user');
});

module.exports = router;
