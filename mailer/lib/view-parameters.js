'use strict';
const moment = require('moment');

function viewParameters(tag, entries, link = "") {
  return {
    subject: moment().format("dddd") + "’s " + tag.name + " update",
    title: tag.name,
    image: tag.image_url,
    description: tag.description + " for " + moment().format("dddd, MMMM Do"),
    link: link,
    entries: entries,
    date: moment().format("dddd, MMMM Do"),
    layout: false
  };
}

module.exports = viewParameters;
