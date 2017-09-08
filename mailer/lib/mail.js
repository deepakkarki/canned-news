'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: process.env.AWS_ID, secretAccessKey: process.env.AWS_SECRET });
const moment = require('moment');
const path = require('path');
const EmailTemplate = require('email-templates').EmailTemplate;
const templateDirectory = path.join(__dirname, '../views');
const s3 = new AWS.S3();
const viewParameters = require('./view-parameters');
const mandrillLibrary = require('mandrill-api/mandrill');
const mandrillApiKey = process.env.MANDRILL_API_KEY;
const baseUrl = process.env.ARCHIVE_URL;
const bucket = process.env.AWS_BUCKET;
const emailSenderEmail = process.env.SENDER_EMAIL;
const emailSenderName = process.env.SENDER_NAME;

function generate(newsletter, entries, emailId) {
  const email = new EmailTemplate(templateDirectory);

  return email.render(viewParameters(newsletter, entries, generateEmailPath(emailId)));
}

function save(html, emailId) {
  const emailFile = 'emails/' + emailId + '.html';
  return s3.putObject({
    Bucket: bucket,
    Key: emailFile,
    Body: html,
    ACL: 'public-read',
    ContentType: 'text/html',
  }).promise().then(result => {
    console.log("Email saved to " + generateEmailPath(emailId));
    return result;
  });
}

function send(emailObject, members) {
  if (mandrillApiKey) {
    const mandrill = new mandrillLibrary.Mandrill(mandrillApiKey);
    const message = {
      "html": emailObject.html,
      "subject": emailObject.subject,
      "from_email": emailSenderEmail,
      "from_name": emailSenderName,
      "to": members,
    };

    return new Promise((resolve) => {
      return mandrill.messages.send({"message": message, "async": true}, resolve);
    }).then(result => {
      console.log(emailObject.subject + " sent");
      return result;
    });
  } else {
    return Promise.resolve("No mail sent");
  }
}

function generateEmailPath(emailId) {
  return baseUrl + 'emails/' + emailId + '.html';
}

module.exports = {generate, save, send};