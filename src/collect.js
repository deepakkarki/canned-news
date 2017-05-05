'use strict';

const feedbin = new (require('feedbin-nodejs'))(
  process.env.FEEDBIN_USERNAME,
  process.env.FEEDBIN_PASSWORD
);

/**
 * Gets the latest from Feedbin via their API
 *
 * @param options
 * @param callback
 *
 * @return {Promise.<*>}
 */
function collect(options, callback) {
  return Promise.all([
    feedbin.taggings.getAll(),
    feedbin.entries.getAll({
      'params': {
        'since': options.since,
        'per_page': options.perPage
      }
    }),
    feedbin.subscriptions.getAll(),
  ]);
}

module.exports = collect;
