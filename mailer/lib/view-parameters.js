'use strict';
const moment = require('moment');

function viewParameters(tag, entries, link = "") {
  return {
    subject: moment().format("dddd") + "’s " + tag.name + " update",
    title: tag.name,
    image: getFeaturedImage(tag, entries),
    description: tag.description + " for " + moment().format("dddd, MMMM Do"),
    link: link,
    entries: entries,
    date: moment().format("dddd, MMMM Do"),
    layout: false
  };
}

function getFeaturedImage(tag, entries) {
  const entryWithImage = entries.find(entry => {
    return entry.image_url;
  });

  if (entryWithImage && entryWithImage.image_url) {
    return entryWithImage.image_url;
  } else if (tag.image_url) {
    return tag.image_url;
  } else {
    return 'https://i.imgur.com/Wx6auJ8.jpg';
  }
}

module.exports = viewParameters;
