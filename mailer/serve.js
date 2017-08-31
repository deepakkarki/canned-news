'use strict';
const express = require('express');
const exphbs  = require('express-handlebars');
const queries = require('./lib/queries');
const viewParameters = require('./lib/view-parameters');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/tags/:tagId', async function (req, res) {
  const tag = await queries.getTag(req.params['tagId']);
  const entries = await queries.getEntries(tag);

  res.render('html', viewParameters(tag, entries));
});

app.listen(3000, function () {
  console.log('Serving on localhost:3000/')
});
