'use strict';
const models = require('fbm-shared/models');

async function transformAndSaveTags(taggings) {
  console.log(taggings.length + " Taggings Found");

  // Get the tag names
  const names = getTagNamesFromTaggings(taggings);

  // Find or create tag objects
  const tags = (await getTagsFromNames(names)).map(tag => tag.get());

  // Save each feed with the appropriate tag
  await Promise.all(taggings.map(tagging => {
    const tag = tags.find(tag => tagging.name === tag.name);
    return findOrCreate(models.Feed, {tag_id: tag.id, feedbin_id: tagging.feed_id});
  }));

  return Promise.resolve(tags);
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

function getTagNamesFromTaggings(results) {
  const names = [];
  for (let i = 0; i < results.length; i++) {
    if (!names.includes(results[i].name)) {
      names.push(results[i].name);
    }
  }
  return names;
}

async function getTagsFromNames(names) {
  return Promise.all(names.map(tagName => {
    return findOrCreate(models.Tag, {name: tagName});
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

module.exports = { transformAndSaveTags, transformAndSaveFeeds, transformAndSaveEntries };
