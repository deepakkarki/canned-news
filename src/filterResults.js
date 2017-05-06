'use strict';
const moment = require('moment');

const feedbin = new (require('feedbin-nodejs'))(
  process.env.FEEDBIN_USERNAME,
  process.env.FEEDBIN_PASSWORD
);

/**
 * Filters results by tagName if provided
 *
 * @param results
 * @param tagName
 *
 * @return {*}
 */
function filterResults(results, tagName) {
  if (tagName) {

    // Get the tags that should be added to this email
    let tags = results[0].filter((tag) => {
      return tag.name === tagName;
    });

    // Get the entries with the specified tag
    let entries = results[1].filter((entry) => {
      return tags.find((tag) =>  entry.feed_id === tag.feed_id);
    });

    return entries.map((entry) => {

      // Attach feed names to each
      entry.feed = results[2].find(feed => {
        return entry.feed_id === feed.feed_id;
      });

      // Update the date format
      entry.published = moment(entry.published).format("dddd, MMMM Do");

      return entry;
    });

  } else {
    return results[1];
  }
}

module.exports = filterResults;