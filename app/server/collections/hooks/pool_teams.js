PoolTeams.before.remove((userId, doc) => {
  PoolTeamPicks.remove({ poolTeamId: doc._id });
});

PoolTeams.after.insert((userId, doc) => {
  Modules.server.poolTeams.updateTeamSummary(doc._id);
});
