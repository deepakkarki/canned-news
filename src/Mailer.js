'use strict';

const ShortId = require('shortid');
const EmailTemplate = require('email-templates').EmailTemplate;
const sendgrid = require('sendgrid').mail;
const fs = require('fs');
const moment = require('moment');

class Mailer {

  constructor(options) {
    this.options = options;
    this.options.tagName = this.options.tagName ? this.options.tagName : "RSS Feeds";
    this.emailId = ShortId.generate();
    this.emailFile = this.options.emailDirectory + "/" + this.emailId + ".html";
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
      'description': this.options.tagDescription,
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
    fs.writeFile(this.emailFile, html, (err) => {
      console.log(err ? err : "File saved to " + this.emailFile);
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
          let subject = "Your daily " + this.options.tagName + " update";
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