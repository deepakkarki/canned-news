'use strict';
const models = require('fbm-shared/models');

async function transformAndSaveTaggings(taggings) {
  // Get all newsletters from db
  const newsletters = await models.Newsletter.findAll();

  // Save each feed with the appropriate newsletter
  await Promise.all(taggings.map(tagging => {
    const newsletter = newsletters.find(newsletter => tagging.name === newsletter.name);
    return findOrCreate(models.Feed, {newsletter_id: newsletter.id, feedbin_id: tagging.feed_id});
  }));

  return Promise.resolve(newsletters);
}

async function transformAndSaveFeeds(subscriptions) {
  console.log(subscriptions.length + " Subscriptions Found");

  return await Promise.all(subscriptions.map(subscription => {
    return updateEach(models.Feed, {feedbin_id: subscription.feed_id}, {
      title: subscription.title,
      feed_url: subscription.feed_url,
      url: subscription.site_url,
    });
  }));
}

async function transformAndSaveEntries(entries) {
  console.log(entries.length + " Entries Found");

  return Promise.all(entries.map(entry => {
    return findOrCreate(models.Entry, {feedbin_id: entry.id}, {
      title: entry.title,
      author: entry.author,
      summary: entry.summary,
      content: entry.content,
      url: entry.url,
      feedbin_published_at: entry.published,
      feedbin_created_at: entry.created_at,
      feedbin_feed_id: entry.feed_id,
      feedbin_id: entry.id,
    });
  }));
}

function findOrCreate(model, options, data = {}) {
  return model.findOne({ where: options }).then(result => {
    if (result) {
      return Promise.resolve(result);
    } else {
      return model.create(Object.assign(options, data));
    }
  });
}

function updateEach(model, options, data = {}) {
  return model.findAll({ where: options }).then(results => {
    if (results) {
      return Promise.all(results.map(result => {
        return result.update(Object.assign(options, data));
      }));
    }
  });
}

module.exports = { transformAndSaveTaggings, transformAndSaveFeeds, transformAndSaveEntries };
