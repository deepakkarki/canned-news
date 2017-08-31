const models = require('fbm-shared/models');

async function getEntries(tag) {
  const maxResults = 10;
  const hoursBack = ((tag.frequency ? tag.frequency : 1) * 24);
  const minDate = (new Date(new Date().getTime() - (hoursBack * 60 * 60 * 1000))).toISOString();

  return models.Entry.findAll({
    attributes: { include:
      [[models.sequelize.literal('(entry.stumbleupon + entry.facebook + entry.pinterest + entry.linkedin)'), 'total_shares']
    ]},
    where: {
      feedbin_published_at: {
        $gt: minDate
      },
      socialized_at: {
        $ne: null
      },
      summarized_at: {
        $ne: null
      },
      url_resolved_at: {
        $ne: null
      },
    },
    include: [{
      model: models.Feed,
      where: { tag_id: tag.id }
    }],
    order: [
      [models.sequelize.literal('"total_shares"'), 'DESC', 'NULLS LAST'],
    ],
    limit: maxResults,
  });
}

async function getTag(id) {
  return models.Tag.findById(id);
}

module.exports = { getEntries, getTag };