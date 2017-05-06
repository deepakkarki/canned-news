'use strict';

const ShortId = require('shortid');
const EmailTemplate = require('email-templates').EmailTemplate;
const sendgrid = require('sendgrid').mail;
const fs = require('fs');
const moment = require('moment');
const AWS = require('aws-sdk');

class Mailer {

  constructor(options) {
    this.options = options;
    this.options.tagName = this.options.tagName ? this.options.tagName : "RSS Feeds";
    this.emailId = ShortId.generate();
    this.emailFile = "emails/" + this.emailId + ".html";
    AWS.config.update({ accessKeyId: process.env.AWS_ID, secretAccessKey: process.env.AWS_SECRET });
    this.s3 = new AWS.S3();
  }

  /**
   * Generate the email as HTML
   *
   * @param entries
   * @param callback
   */
  generate(entries, callback) {
    // Generate the email
    let emailContent = new EmailTemplate(this.options.templateDirectory);

    return emailContent.render({
      'title': this.options.tagName,
      'description': this.options.tagDescription + " for " + moment().format("dddd, MMMM Do"),
      'link': this.options.baseUrl + this.emailId + '.html',
      'entries': entries,
      'date': moment().format("dddd, MMMM Do")
    }, callback);
  }

  /**
   * Save the file as HTML
   *
   * @param html
   * @param callback
   */
  save(html, callback) {
    let bucket = process.env.AWS_BUCKET;
    this.s3.putObject({
      Bucket: bucket,
      Key: this.emailFile,
      Body: html,
      ACL: 'public-read',
      ContentType: 'text/html',
    }, (err) => {
      console.log(err ? err : 'File saved to '+process.env.BASE_URL+this.emailFile);
      return callback(err, this.emailFile);
    });

  }

  /**
   * Generate and send the email
   *
   * @param entries
   * @param callback
   */
  send(entries, callback) {

    this.generate(entries, (err, renderedEmail) => {

      this.save(renderedEmail.html, (err) => {

        // Send the mail via sendgrid
        if (this.options.sendgridApiKey) {
          let fromEmail = new sendgrid.Email(this.options.senderEmail, this.options.senderName);
          let toEmail = new sendgrid.Email(this.options.recipientEmail);
          let subject = moment().format("dddd") + "'s " + this.options.tagName + " update";
          let content = new sendgrid.Content('text/html', renderedEmail.html);
          let mail = new sendgrid.Mail(fromEmail, subject, toEmail, content);

          let sg = require('sendgrid')(this.options.sendgridApiKey);
          let request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
          });

          sg.API(request, function (err) {
            return callback(err, "Email sent");
          });
        } else {
          return callback("Mail not sent");
        }
      });
    });
  }
}

module.exports = Mailer;