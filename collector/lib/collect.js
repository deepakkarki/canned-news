'use strict';

const feedbin = new (require('feedbin-nodejs'))(
  process.env.FEEDBIN_USERNAME,
  process.env.FEEDBIN_PASSWORD
);

function tags(options) {
  return feedbin.taggings.getAll(options);
}

function feeds(options) {
  return feedbin.subscriptions.getAll(options);
}

function entries(options) {
  return feedbin.entries.getAll(options);
}

module.exports = { tags, feeds, entries };
