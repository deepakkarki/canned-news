'use strict';
const collect = require('./lib/collect');
const db = require('./lib/db');
const hoursBack = process.env.HOURS_BACK;
const perPage = process.env.RESULTS_PER_PAGE;

// Setting up the data from the API
const taggings = collect.taggings();
const subscriptions = collect.feeds();
const entries = collect.entries({'params': {
  // Retrieves entries posted in past x hours
  'since': (new Date(new Date().getTime() - (hoursBack * 60 * 60 * 1000))).toISOString(),
  'per_page': perPage,
}});

function run() {
  return Promise.all([
    taggings.then(results => {
      return db.transformAndSaveTaggings(results).then(() => {
        return subscriptions.then(feeds => db.transformAndSaveFeeds(feeds));
      });
    }),
    entries.then(results => db.transformAndSaveEntries(results))
  ]);
}

run().then(() => {
  console.log("Collected entries from the past " + hoursBack + " hours.");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
