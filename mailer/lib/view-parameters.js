'use strict';
const moment = require('moment');
const backupImage = 'https://i.imgur.com/Wx6auJ8.jpg';
const baseUrl = process.env.BASE_URL;
const siteName = 'Canned News';
const unsubLink = 'http://karllhughes.us15.list-manage.com/unsubscribe?u=4eba8b205fc13380cd3e6f3fc&id=8360d0442f';

function viewParameters(tag, entries, link = "") {
  return {
    subject: moment().format("dddd") + "’s " + tag.name + " update",
    title: tag.name,
    image: getFeaturedImage(tag, entries),
    description: tag.description + " for " + moment().format("dddd, MMMM Do"),
    link: link,
    entries: entries,
    date: moment().format("dddd, MMMM Do"),
    layout: false,
    homepage_url: baseUrl,
    homepage_name: siteName,
    unsubscribe: unsubLink,
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
    return backupImage;
  }
}

module.exports = viewParameters;
