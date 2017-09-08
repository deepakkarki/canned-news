const models = require('fbm-shared/models');

async function getEntries(newsletter) {
  const maxResults = 10;
  const hoursBack = ((newsletter.frequency ? newsletter.frequency : 1) * 24);
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
      where: { newsletter_id: newsletter.id }
    }],
    order: [
      [models.sequelize.literal('"total_shares"'), 'DESC', 'NULLS LAST'],
    ],
    limit: maxResults,
  });
}

async function getNewsletter(id) {
  return models.Newsletter.findById(id);
}

module.exports = { getEntries, getNewsletter };