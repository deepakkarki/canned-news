'use strict';

const ShortId = require('shortid');
const EmailTemplate = require('email-templates').EmailTemplate;
const sendgrid = require('sendgrid').mail;
const fs = require('fs');

function sendMail(entries, options, callback) {

  // Generate the email
  let emailId = ShortId.generate();
  let emailContent = new EmailTemplate(options.templateDirectory);
  let emailFile = options.emailDirectory + "/" + emailId + ".html";

  emailContent.render({
    'title': options.tagName,
    'description': options.tagDescription,
    'link': options.baseUrl + emailId + '.html',
    'entries': entries,
    'date': (new Date).toDateString()
  }, function saveFile(err, renderedEmail) {
    if (err) {
      return callback(err);
    }
    fs.writeFile(emailFile, renderedEmail.html, (err) => {
      console.log(err ? err : "File saved to " + emailFile);

      // Send the mail via sendgrid
      if (options.sendgridApiKey) {
        let fromEmail = new sendgrid.Email(options.senderEmail);
        let toEmail = new sendgrid.Email(options.recipientEmail);
        let subject = "Your daily " + options.tagName + " update";
        let content = new sendgrid.Content('text/html', renderedEmail.html);
        let mail = new sendgrid.Mail(fromEmail, subject, toEmail, content);

        let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
        let request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });

        sg.API(request, function (err) {
          return callback(err, "Success");
        });
      } else {
        return callback("Mail not sent");
      }
    });
  });
}

module.exports = sendMail;
