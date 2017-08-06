'use strict';

const startDate = require('./src/startDate');
const collect = require('./src/collect');
const filterResults = require('./src/filterResults');
const Mailer = require('./src/Mailer');
const path = require('path');

// Get the data from feedbin
collect({
  perPage: 600,
  since: startDate(process.env.DAYS_BACK)
}).then((entries) => {

  // Options
  const options = {
    tagName: process.env.FEEDBIN_TAG_NAME,
    tagDescription: "Your Feedbin newsletter",
    baseUrl: process.env.BASE_URL + 'emails/',
    recipientEmail: process.env.RECIPIENT_EMAIL,
    senderEmail: process.env.SENDER_EMAIL,
    senderName: process.env.SENDER_NAME,
    templateDirectory: path.join(__dirname, 'templates', 'daily'),
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
