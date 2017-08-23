'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres', process.env.POSTGRES_PASSWORD, {
  host: 'postgres',
  dialect: 'postgres',
  logging: false,
});
const moment = require('moment');

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
  stumbleupon: Sequelize.INTEGER,
  pinterest: Sequelize.INTEGER,
  linkedin: Sequelize.INTEGER,
  facebook: Sequelize.INTEGER,
  sharedcount_stats: Sequelize.JSONB,
  url_resolved_at: Sequelize.DATE,
  summarized_at: Sequelize.DATE,
  socialized_at: Sequelize.DATE,
  image_extracted_at: Sequelize.DATE,
}, {
  underscored: true,
  getterMethods: {
    feedbin_published_at() {
      return moment(this.getDataValue('feedbin_published_at')).format("MMMM Do [at] h:mm a");
    }
  },
});

Entry.belongsTo(Feed, {foreignKey: 'feedbin_feed_id', targetKey: 'feedbin_id'});

module.exports = { Tag, Feed, Entry, sequelize };
