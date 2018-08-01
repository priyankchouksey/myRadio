const functions = require('firebase-functions');
var nodemailer = require('nodemailer');

let poolConfig = {
  host: 'us2.smtp.mailhostbox.com',
  port: 25,
  secure: true, // use TLS
  auth: {
      user: 'getintouch@myradio.live',
      pass: 'unni1312'
  },
  tls: {rejectUnauthorized: false},
  debug: true
};
var transporter = nodemailer.createTransport(poolConfig);

var mailOptions = {
  from: 'getintouch@myradio.live',
  to: 'priyank.chouksey@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.sendMail = functions.https.onRequest((request, response) => {
  request.body.emailData
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      response.send({'status': 'error3', 'data': error});
    } else {
      response.send({'status': 'success', 'data': info.response});
    }
  });
//  response.send(request.body);
});
