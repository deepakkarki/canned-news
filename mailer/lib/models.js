'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres', process.env.POSTGRES_PASSWORD, {
  host: 'postgres',
  dialect: 'postgres',
  logging: false,
});

const Tag = sequelize.define('tag', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: Sequelize.STRING,
  frequency: Sequelize.STRING,
  image_url: Sequelize.STRING,
  description: Sequelize.TEXT,
}, {
  underscored: true,
  timestamps: true,
  createdAt: false,
});

const Feed = sequelize.define('feed', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  title: Sequelize.STRING,
  url: Sequelize.TEXT,
  feed_url: Sequelize.TEXT,
  feedbin_id: Sequelize.INTEGER,
  tag_id: Sequelize.INTEGER,
}, {
  underscored: true,
  timestamps: true,
  createdAt: false,
});

const Entry = sequelize.define('entry', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: Sequelize.STRING,
  author: Sequelize.STRING,
  summary: Sequelize.TEXT,
  content: Sequelize.TEXT,
  url: Sequelize.TEXT,
  feedbin_published_at: Sequelize.DATE,
  feedbin_created_at: Sequelize.DATE,
  feedbin_feed_id: Sequelize.INTEGER,
  feedbin_id: Sequelize.INTEGER,
}, {
  underscored: true,
});

module.exports = { Tag, Feed, Entry, sequelize };
