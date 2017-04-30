'use strict';

const startDate = require('./src/startDate');
const collect = require('./src/collect');
const filterResults = require('./src/filterResults');
const Mailer = require('./src/Mailer');
const path = require('path');

// Get the data from feedbin
collect({
  perPage: 200,
  since: startDate()
}).then((entries) => {

  // Options
  const options = {
    tagName: "Engineering Blogs",
    tagDescription: "A daily email from your latest Feedbin posts.",
    baseUrl: 'https://www.example.com/emails/',
    recipientEmail: 'khughes.me@gmail.com',
    senderEmail: 'admin@jobapis.com',
    templateDirectory: path.join(__dirname, 'templates', 'daily'),
    emailDirectory: path.join(__dirname, 'emails'),
    sendgridApiKey: process.env.SENDGRID_API_KEY,
  };

  // Filter entries by tag name
  entries = filterResults(entries, options.tagName);
  console.log("Entries found: " + entries.length);

  // Compose and send the email
  const mailer = new Mailer(options);
  mailer.send(entries, (err, results) => {
    console.log(err ? err : results);
  });

});
