const express = require('express');
const nodemailer = require('nodemailer');

exports.sendEmail = (req, res, next) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass // generated ethereal password
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: req.body.fromAddress, // sender address
      to: req.body.toAddress, // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.body, // plain text body
      attachments: getAttachments(req.files)
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
  next();
};

function getAttachments(files) {
  return files.reduce((acc, file) => {
    const attachment = {};
    attachment.filename = file.origionalname;
    attachment.content = file.buffer;
    return [...acc, attachment];
  }, [])
}
