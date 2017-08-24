'use strict';
const models = require('fbm-shared/models');
const request = require('request-promise-native');
const urlParser = require('url');
const hoursBack = process.env.HOURS_BACK;


async function run() {
  const entries = await getEntries();

  return Promise.all(entries.map((entry) => {
    const url = urlParser.parse(entry.url);

    return request({
      method: 'HEAD',
      uri: url,
      resolveWithFullResponse: true,
    }).then(async (result) => {
      let finalUrl = entry.url;
      if (result.request.uri.href && result.request.uri.href.length) {
        finalUrl = result.request.uri.href;
      }
      return await entry.update({
        url: finalUrl,
        url_resolved_at: (new Date()).toISOString(),
      });
    }).catch(err => {
      console.error(err.toString());
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
      url_resolved_at: {
        $eq: null
      }
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
