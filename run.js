'use strict';
const https = require('https');
const Feedbin = require('feedbin-nodejs');
const ShortId = require('shortid');
const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');
const fs = require('fs');
const sendgrid = require('sendgrid').mail;

// Misc constants
const tagName = "Engineering Blogs";
const tagDescription = "A daily email from your latest Feedbin posts.";
const resultsPerPage = 200;
const baseUrl = 'https://www.example.com/emails/';
const recipientEmail = 'khughes.me@gmail.com';
const senderEmail = 'admin@jobapis.com';

// Instantiate Feedbin client
const feedbin = new Feedbin(process.env.FEEDBIN_USERNAME, process.env.FEEDBIN_PASSWORD);

// Get Yesterday's date in ISO format
const date = new Date();
let since = new Date(date.setDate(date.getDate() - 1)).toISOString();

// Get the 'taggings' and 'entries'
Promise.all([
  feedbin.taggings.getAll(),
  feedbin.entries.getAll({
    'params': {
      'since': since,
      'per_page': resultsPerPage
    }
  })
]).then((results) => {

  // Get the tags that should be added to this email
  let tags = results[0].filter((tag) => {
    return tag.name === tagName;
  });

  // Get the entries with an Engineering Blogs tag
  let entries = results[1].filter((entry) => {
    return tags.find((tag) =>  entry.feed_id === tag.feed_id);
  });

  // Summary of results
  console.log("Entries found: " + results[1].length);
  console.log("Entries found (filtered): " + entries.length);

  // Generate the email
  let emailId = ShortId.generate();
  let templateDirectory = path.join(__dirname, 'templates', 'daily');
  let emailDirectory = path.join(__dirname, 'emails');
  let emailContent = new EmailTemplate(templateDirectory);
  let emailFile = emailDirectory + "/" + emailId + ".html";

  emailContent.render({
    'title': tagName,
    'description': tagDescription,
    'link': baseUrl + emailId + '.html',
    'entries': entries,
    'date': (new Date).toDateString()
  }, function (err, renderedEmail) {
    fs.writeFile(emailFile, renderedEmail.html, (err) => {
      console.log(err ? err : "File saved to " + emailFile);

      // Send the mail via sendgrid
      if (process.env.SENDGRID_API_KEY) {
        let fromEmail = new sendgrid.Email(senderEmail);
        let toEmail = new sendgrid.Email(recipientEmail);
        let subject = "Your daily " + tagName + " update";
        let content = new sendgrid.Content('text/html', renderedEmail.html);
        let mail = new sendgrid.Mail(fromEmail, subject, toEmail, content);

        let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
        let request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });

        sg.API(request, function (err) {
          console.log(err ? err : "Mail sent to  " + toEmail.email);
        });
      } else {
        console.log("Mail not sent");
      }

    });
  });

});
