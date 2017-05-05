'use strict';

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

    // Attach feed names to each
    return entries.map((entry) => {
      entry.feed = results[2].find(feed => {
        return entry.feed_id === feed.feed_id;
      });
      return entry;
    });

  } else {
    return results[1];
  }
}

module.exports = filterResults;