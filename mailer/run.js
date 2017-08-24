'use strict';
const models = require('fbm-shared/models');
const queries = require('./lib/queries');
const Mailer = require('./lib/Mailer');
const path = require('path');

async function run() {
  // Get all the tags
  const tags = await models.Tag.findAll();

  // Send an email for each one
  return Promise.all(tags.map(async tag => {

    // Get the entries that correspond to it
    const entries = await queries.getEntries(tag);

    console.log(entries.length + " entries found for tag '" + tag.name + "'");

    // Compose and send the email
    if (entries && entries.length) {
      const mailer = new Mailer(getOptions(tag));
      return new Promise((resolve) => {
        mailer.send(entries, resolve);
      });
    }
  }));
}

function getOptions(tag) {
  return {
    tagName: tag.name,
    tagDescription: tag.description,
    tagImage: tag.image_url,
    baseUrl: process.env.BASE_URL + 'emails/',
    recipientEmail: process.env.FEEDBIN_USERNAME,
    senderEmail: process.env.SENDER_EMAIL,
    senderName: process.env.SENDER_NAME,
    templateDirectory: path.join(__dirname, 'templates', 'daily'),
    sendgridApiKey: process.env.SENDGRID_API_KEY,
  };
}

run().then(() => {
  console.log("Mailer job complete.");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
