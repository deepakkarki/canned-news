'use strict';
const mail = require('./lib/mail');
const models = require('fbm-shared/models');
const queries = require('./lib/queries');
const shortId = require('shortid');

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
      // Generate an id
      const emailId = shortId.generate();

      // Generate the email
      const email = await mail.generate(tag, entries, emailId);

      // Save the html to S3
      await mail.save(email.html, emailId);

      // Send the email through sendgrid
      return mail.send(email, emailId);
    }
  }));
}

run().then(() => {
  console.log("Mailer job complete.");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
