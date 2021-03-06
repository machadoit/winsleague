import { Meteor } from 'meteor/meteor';
import { Mailer } from 'meteor/lookback:emails';
import log from '../../utils/log';

import weeklyLeaderboardTemplate from './mailer/weekly-leaderboard-template';
import weeklyTopUpcomingGamesTemplate from './mailer/weekly-top-upcoming-games-template';

Mailer.config({
  from: 'Wins League <no-reply@winsleague.com>',
  routePrefix: 'emails',              // Route prefix.
  baseUrl: process.env.ROOT_URL,      // The base domain to build absolute link URLs from in the emails.
  testEmail: 'team@winsleague.com',  // Default address to send test emails to.
  logger: log,
  addRoutes: Meteor.isDevelopment,
  plainTextOpts: {
    ignoreImage: true,
  },
});

Meteor.startup(() => {
  Mailer.init({
    templates: {
      weeklyLeaderboardTemplate,
      weeklyTopUpcomingGamesTemplate,
    },
    helpers: {},
    layout: {
      name: 'emailLayout',
      path: 'layout.html',   // Relative to 'private' dir.
      css: 'layout.css',
    },
  });
});
