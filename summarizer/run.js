'use strict';
const models = require('fbm-shared/models');
const request = require('request-promise-native');
const hoursBack = process.env.HOURS_BACK;
const summarizerAppId = process.env.AYLIEN_APP_ID;
const summarizerKey = process.env.AYLIEN_KEY;
const summarizerUrl = 'https://api.aylien.com/api/v1/summarize';
const summarizerSentences = 3;

async function run() {
  const entries = await getEntries();

  return Promise.all(entries.map(async (entry) => {

    return request({
      uri: summarizerUrl,
      qs: {
        url: entry.url,
        sentences_number: summarizerSentences,
      },
      headers: {
        'X-AYLIEN-TextAPI-Application-ID': summarizerAppId,
        'X-AYLIEN-TextAPI-Application-Key': summarizerKey,
      },
      json: true,
    }).then(async (result) => {
      let summary = entry.summary;
      if (result && result.sentences && result.sentences.length) {
        summary = result.sentences.join(' ');
      }

      let content = entry.content;
      if (result && result.text && result.text.length) {
        content = result.text;
      }

      return await entry.update({
        summary: summary,
        content: content,
        summarized_at: (new Date()).toISOString(),
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
        $ne: null
      },
      summarized_at: {
        $eq: null
      },
    },
  });
}

run().then((entries) => {
  console.log("Summarized " + entries.length + " entries less than " + hoursBack + " hours old.");
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
