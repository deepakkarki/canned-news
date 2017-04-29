'use strict';
const https = require('https');
const ShortId = require('shortid');

// Feedbin username/password
const username = process.env.FEEDBIN_USERNAME;
const password = process.env.FEEDBIN_PASSWORD;

// Yesterday's date in ISO format
let date = new Date();
let since = new Date(date.setDate(date.getDate() - 1)).toISOString();

// Get results from feedbin
https.get({
    hostname: 'api.feedbin.com',
    path: '/v2/entries.json?since='+since,
    headers: {
      'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
    }
  }, (res) => {
    let body = "";
    res.on('data', (data) => body += data);

    // Complete
    res.on('end', function() {
      console.log(body);
    });

    // Show errors
    res.on('error', function(e) {
      console.error("Got error: " + e.message);
    });
});


// ShortId.generate()