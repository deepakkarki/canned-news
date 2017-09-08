'use strict';
const MC = require('mailchimp-api-v3');
const mailchimp = new MC(process.env.MAILCHIMP_API_KEY);

async function get(newsletter) {
  if (newsletter.mc_list_id && newsletter.mc_interest_category_id && newsletter.mc_interest_id) {
    const results = await mailchimp.get({
      path: '/lists/' + newsletter.mc_list_id + '/members',
      query: {
        offset: 0,
        count: 1000,
        interest_category_id: newsletter.mc_interest_category_id,
        interest_ids: newsletter.mc_interest_id,
        interest_match: 'all',
      },
    });
    return results.members.map(member => {
      return {
        email: member.email_address,
        type: 'to'
      }
    });
  }
  return [];
}

module.exports = { get };
