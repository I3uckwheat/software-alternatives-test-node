const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');


const upload = multer({storage: multer.memoryStorage()});

const app = express();

const emailController = require('./controllers/emailController');
const validator = require('./helpers/validator');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<a href="/send-email">Email Editor</a>');
});

// Email Routes
app.get('/send-email', (req, res) => {
  res.sendFile(__dirname + '/views/email.html');
});

app.post(
  '/send-email',
  upload.single('attachments'),
  validator.validate({
    toAddress: 'email',
    fromAddress: 'email',
    body: 'exists',
    subject: 'exists'
  }),
  emailController.sendEmail,
  (req, res) => {
    res.redirect('/');
  }
);

app.listen(7777);
