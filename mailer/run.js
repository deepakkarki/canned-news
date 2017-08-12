'use strict';
const models = require('./lib/models');
const Mailer = require('./lib/Mailer');
const path = require('path');

function run() {
  // Get all the tags
  return models.Tag.findAll().then(tags => Promise.all(tags.map(async tag => {

    // Set up the options for input
    const options = {
      tagName: tag.name,
      tagDescription: tag.description,
      baseUrl: process.env.BASE_URL + 'emails/',
      recipientEmail: process.env.FEEDBIN_USERNAME,
      senderEmail: process.env.SENDER_EMAIL,
      senderName: process.env.SENDER_NAME,
      templateDirectory: path.join(__dirname, 'templates', 'daily'),
      sendgridApiKey: process.env.SENDGRID_API_KEY,
    };

    // Get the entries that correspond to it
    const rawQuery = "select entries.* from entries " +
      "join feeds on entries.feedbin_feed_id = feeds.feedbin_id " +
      "where feeds.tag_id = " + tag.id +
      "and entries.feedbin_published_at > '2017-08-11'";
    const entries = await models.sequelize.query(rawQuery, { model: models.Entry });

    console.log(entries.length + " entries found for tag '" + tag.name + "'");

    // Compose and send the email
    const mailer = new Mailer(options);
    return new Promise((resolve) => {
      mailer.send(entries, resolve);
    });

  })));
}

run().then(() => {
  console.log("Mailer job complete.");
  process.exit(1);
}).catch(e => {
  console.error(e);
  process.exit(0);
});
