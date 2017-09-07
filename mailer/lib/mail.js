'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: process.env.AWS_ID, secretAccessKey: process.env.AWS_SECRET });
const moment = require('moment');
const path = require('path');
const EmailTemplate = require('email-templates').EmailTemplate;
const templateDirectory = path.join(__dirname, '../views');
const s3 = new AWS.S3();
const sendgrid = require('sendgrid').mail;
const viewParameters = require('./view-parameters');
const baseUrl = process.env.ARCHIVE_URL;
const bucket = process.env.AWS_BUCKET;
const sendgridApiKey = process.env.SENDGRID_API_KEY;
const emailSenderEmail = process.env.SENDER_EMAIL;
const emailSenderName = process.env.SENDER_NAME;
const emailReicipientEmail = process.env.FEEDBIN_USERNAME;

function generate(tag, entries, emailId) {
  const email = new EmailTemplate(templateDirectory);

  return email.render(viewParameters(tag, entries, generateEmailPath(emailId)));
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

function send(emailObject) {
  if (sendgridApiKey) {
    let fromEmail = new sendgrid.Email(emailSenderEmail, emailSenderName);
    let toEmail = new sendgrid.Email(emailReicipientEmail);
    let content = new sendgrid.Content('text/html', emailObject.html);
    let mail = new sendgrid.Mail(fromEmail, emailObject.subject, toEmail, content);

    let sg = require('sendgrid')(sendgridApiKey);
    let request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    return new Promise((resolve) => sg.API(request, resolve)).then(result => {
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