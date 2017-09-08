'use strict';
const mail = require('./lib/mail');
const models = require('fbm-shared/models');
const queries = require('./lib/queries');
const shortId = require('shortid');
const list = require('./lib/members');

async function run() {
  // Get all the newsletters
  const newsletters = await models.Newsletter.findAll();

  // Send an email for each one
  return Promise.all(newsletters.map(async newsletter => {

    // Get the entries that correspond to it
    const entries = await queries.getEntries(newsletter);

    console.log(entries.length + " entries found for newsletter '" + newsletter.name + "'");

    // Compose and send the email
    if (entries && entries.length) {
      // Generate an id
      const emailId = shortId.generate();

      // Generate the email
      const email = await mail.generate(newsletter, entries, emailId);

      // Get the list members to send to
      const members = await list.get(newsletter);

      // Save the html to S3
      await mail.save(email.html, emailId);

      // Send the email through sendgrid
      return mail.send(email, members);
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
