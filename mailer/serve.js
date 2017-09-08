'use strict';
const express = require('express');
const exphbs  = require('express-handlebars');
const queries = require('./lib/queries');
const viewParameters = require('./lib/view-parameters');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/newsletters/:id', async function (req, res) {
  const newsletter = await queries.getNewsletter(req.params['id']);
  const entries = await queries.getEntries(newsletter);

  res.render('html', viewParameters(newsletter, entries));
});

app.listen(3000, function () {
  console.log('Serving on localhost:3000/')
});
