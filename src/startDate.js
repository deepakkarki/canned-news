'use strict';

/**
 * Gets an ISO string as a start date
 *
 * @param daysBack
 *
 * @return {string}
 */
function startDate(daysBack) {
  daysBack = daysBack ? daysBack : 1;
  const date = new Date();
  return new Date(date.setDate(date.getDate() - daysBack)).toISOString();
}

module.exports = startDate;
