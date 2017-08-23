'use strict';
const models = require('fbm-shared/models');
const unshorten = require('unshorten');
const hoursBack = process.env.HOURS_BACK;

async function run() {
  const entries = await getEntries();

  console.log(entries.length);
  return Promise.all(entries.map(async (entry) => {
    return await new Promise((resolve) => {
      unshorten(entry.url, resolve);
    }).then(async (url) => {
        console.log(url);
        return await entry.update({
          url: url,
          url_resolved_at: (new Date()).toISOString(),
        });
    }).catch(err => {
      console.log(err);
      return err;
    });
  }));
}

function getEntries() {
  const minDate = (new Date(new Date().getTime() - (hoursBack * 60 * 60 * 1000))).toISOString();

  return models.Entry.findAll({
    where: {
      feedbin_published_at: {
        $gt: minDate
      },
      /*
      url_resolved_at: {
        $eq: null
      }
      */
    },
  });
}

run().then((entries) => {
  console.log("Resolved urls for " + entries.length + " entries less than " + hoursBack + " hours old.");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
