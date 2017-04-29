'use strict';
const https = require('https');
const Feedbin = require('feedbin-nodejs');
const ShortId = require('shortid');

// Feedbin client
const username = process.env.FEEDBIN_USERNAME;
const password = process.env.FEEDBIN_PASSWORD;
const feedbin = new Feedbin(username, password);

// Yesterday's date in ISO format
let date = new Date();
let since = new Date(date.setDate(date.getDate() - 1)).toISOString();

// Get the taggings and entries
Promise.all([
  feedbin.taggings.getAll(),
  feedbin.entries.getAll({
    'params': {
      'since': since,
      'per_page': 200
    }
  })
]).then((results) => {

  // Get the tags that should be added to this email
  let tags = results[0].filter((tag) => {
    return tag.name === "Engineering Blogs";
  });

  // Get the entries with an Engineering Blogs tag
  let entries = results[1].filter((entry) => {
    return tags.find((tag) =>  entry.feed_id === tag.feed_id);
  });
  console.log("Entries found: " + results[1].length);
  console.log("Entries found (filtered): " + entries.length);


});

// ShortId.generate()