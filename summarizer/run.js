'use strict';
const models = require('fbm-shared/models');
const request = require('request-promise-native');
const hoursBack = process.env.HOURS_BACK;
const summarizerUrl = 'https://api.aylien.com/api/v1/summarize';

async function run() {
  const entries = await getEntries();

  return Promise.all(entries.map(async (entry) => {
    const url = await new Promise((resolve) => {
      unshorten(entry.url, resolve);
    });
    console.log(entry.url, url);
    return url;
    /*
    return request({
      uri: 'https://api.sharedcount.com/v1.0/',
      qs: {
        url: entry.url,
        apikey: process.env.SHAREDCOUNT_API_KEY,
      },
      json: true,
    }).then(async (result) => {
      return await entry.update({
        stumbleupon: result.StumbleUpon,
        pinterest: result.Pinterest,
        linkedin: result.LinkedIn,
        facebook: result.Facebook.total_count,
        sharedcount_stats: result,
      });
    });
    */
  }));
}

function getEntries() {
  const minDate = (new Date(new Date().getTime() - (hoursBack * 60 * 60 * 1000))).toISOString();

  return models.Entry.findAll({
    where: {
      feedbin_published_at: {
        $gt: minDate
      }
    },
    limit: 10,
  });
}

run().then((entries) => {
  console.log("Collected summaries from " + entries.length + " entries less than " + hoursBack + " hours old.");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
