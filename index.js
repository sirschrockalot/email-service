const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;
// const port = 3000;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
// const cors = require('cors');
// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart({ uploadDir: './uploads' });

// var corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200
// };

// app.use(cors());
app.use(fileUpload());

// var auth = {
//   type: 'OAuth2',
//   user: 'joel.schrock@gmail.com',
//   clientId: '1076818140633-119qd0jse81pgnognfc51d6qv0hlnmt6.apps.googleusercontent.com',
//   clientSecret: 'BvNoOZAwzpIP_OaZkjcnrZ2X'
//   // refreshToken: 'YOUR_REFRESH_TOKEN'
// };

// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

// Use the mv() method to place the file somewhere on your server

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

let transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'roberta22@ethereal.email', // generated ethereal user
    pass: 'P1kEMy7RntPRxgq5xZ' // generated ethereal password
  }
});

app.post('/send', (req, res) => {
  console.log('Request Files: ' + req.files); // list of the files
  console.log('Request Body: ' + req.body); // request body, like email

  let senderName = req.body.contactFormName;
  let senderEmail = req.body.contactFormEmail;
  let messageSubject = req.body.contactFormSubjects;
  let messageText = req.body.contactFormMessage;
  let copyToSender = req.body.contactFormCopy;
  // let fileUpload = req.files.;
  let sampleFile = req.files.contactFormFile;
  console.log(sampleFile);
  // console.log(req.files);

  sampleFile.mv('/tmp' + sampleFile.name, function(err) {
    console.log(err);
    if (err) {
      console.log('Sample File move had an error:' + err);
    }

    // res.send('File uploaded!');
  });

  let mailOptions = {
    to: ['"JetCuts Quote" customer@gmail.com'], // Enter here the email address on which you want to send emails from your customers
    from: 'shannon@jetcutswi.com',
    subject: messageSubject,
    text: messageText,
    replyTo: senderEmail,
    attachments: [
      {
        // file on disk as an attachment
        // filename: 'duel-head.jpg',
        path: '/tmp/' + sampleFile.name // stream this file
      }
    ]
  };

  if (senderName === '') {
    res.status(400);
    res.send({
      message: 'Bad request'
    });
    return;
  }

  if (senderEmail === '') {
    res.status(400);
    res.send({
      message: 'Bad request'
    });
    return;
  }

  if (messageSubject === '') {
    res.status(400);
    res.send({
      message: 'Bad request'
    });
    return;
  }

  if (messageText === '') {
    res.status(400);
    res.send({
      message: 'Bad request'
    });
    return;
  }

  if (copyToSender) {
    mailOptions.to.push(senderEmail);
  }

  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      res.end('error');
    } else {
      console.log('Message sent: ', response);
      res.end('sent');
    }
  });
});

app.listen(port, function() {
  console.log('Express started on port: ', port);
});

module.exports = {
  app
};
