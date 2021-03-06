import log from '../../../utils/log';

import { Games } from '../../games/games';
import { SeasonLeagueTeams } from '../../season_league_teams/season_league_teams';
import '../../season_league_teams/server/hooks';

export default {
  updateTeamStats(leagueId, seasonId, leagueTeamId) {
    if (!leagueId) {
      throw new Error('Undefined leagueId!');
    }
    if (!seasonId) {
      throw new Error('Undefined seasonId!');
    }
    if (!leagueTeamId) {
      throw new Error('Undefined leagueTeamId!');
    }

    log.info(`Updating stats for seasonId ${seasonId} and leagueTeam ${leagueTeamId}`);

    const games = Games.find({ leagueId, seasonId, status: 'completed',
      $or: [{ homeTeamId: leagueTeamId }, { awayTeamId: leagueTeamId }] });
    let wins = 0, losses = 0, ties = 0,
      homeWins = 0, homeLosses = 0, homeTies = 0,
      awayWins = 0, awayLosses = 0, awayTies = 0,
      pointsFor = 0, pointsAgainst = 0;
    games.forEach((game) => {
      if (game.homeTeamId === leagueTeamId) {
        if (game.homeScore > game.awayScore) {
          wins += 1;
          homeWins += 1;
        } else if (game.homeScore < game.awayScore) {
          losses += 1;
          homeLosses += 1;
        } else {
          ties += 1;
          homeTies += 1;
        }
        pointsFor += game.homeScore;
        pointsAgainst += game.awayScore;
      } else if (game.awayTeamId === leagueTeamId) {
        if (game.awayScore > game.homeScore) {
          wins += 1;
          awayWins += 1;
        } else if (game.awayScore < game.homeScore) {
          losses += 1;
          awayLosses += 1;
        } else {
          ties += 1;
          awayTies += 1;
        }
        pointsFor += game.awayScore;
        pointsAgainst += game.homeScore;
      }
    });

    const result = SeasonLeagueTeams.upsert({ leagueId, seasonId, leagueTeamId },
      { $set: {
        wins, losses, ties,
        homeWins, homeLosses, homeTies,
        awayWins, awayLosses, awayTies,
        pointsFor, pointsAgainst,
      } });
    log.debug(`SeasonLeagueTeams.upsert: ${result.numberAffected} rows affected`);
  },
};
