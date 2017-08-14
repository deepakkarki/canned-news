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
      tagImage: tag.image_url,
      baseUrl: process.env.BASE_URL + 'emails/',
      recipientEmail: process.env.FEEDBIN_USERNAME,
      senderEmail: process.env.SENDER_EMAIL,
      senderName: process.env.SENDER_NAME,
      templateDirectory: path.join(__dirname, 'templates', 'daily'),
      sendgridApiKey: process.env.SENDGRID_API_KEY,
    };

    // Get the entries that correspond to it
    const entries = await getEntries(tag);

    console.log(entries.length + " entries found for tag '" + tag.name + "'");

    // Compose and send the email
    if (entries && entries.length) {
      const mailer = new Mailer(options);
      return new Promise((resolve) => {
        mailer.send(entries, resolve);
      });
    }

  })));
}

async function getEntries(tag) {
  // Add 1-hour margin of error to query.
  const hoursBack = ((tag.frequency ? tag.frequency : 1) * 24) + 1;
  const minDate = (new Date(new Date().getTime() - (hoursBack * 60 * 60 * 1000))).toISOString();

  return models.Entry.findAll({
    where: {
      feedbin_published_at: {
        $gt: minDate
      }
    },
    include: [{
      model: models.Feed,
      where: { tag_id: tag.id }
    }]
  });
}

run().then(() => {
  console.log("Mailer job complete.");
  process.exit(1);
}).catch(e => {
  console.error(e);
  process.exit(0);
});
