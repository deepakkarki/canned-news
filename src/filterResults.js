'use strict';

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

    // Get the entries with an Engineering Blogs tag
    return results[1].filter((entry) => {
      return tags.find((tag) =>  entry.feed_id === tag.feed_id);
    });
  } else {
    return results[1];
  }
}

module.exports = filterResults;