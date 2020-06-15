const authenticator = require('otplib/authenticator');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const otp = function () {
  authenticator.options = { crypto };
  const secret = ''; //Your Secret
  const value = authenticator.generate(secret);
  return value;
};

const apiKey = ''; //Your SGmail Api Keey

sgMail.setApiKey(apiKey);

const sendWelcomeEmail = (email, name) => {
  const value = otp();
  const otpValue = value;
  sgMail.send({
    To: email, //to email
    from: '', //your email
    subject: 'Notes App-Password Reset',
    text: `Hello ${name} This Is Your Otp to Change Your Password ${otpValue}`,
    //html:'' //if you wanna send html  in email
  });
  return otpValue;
};
module.exports = { otp, sendWelcomeEmail };
