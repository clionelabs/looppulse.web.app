/**
 * Here defines every publication.
 */

/**
 * Poi Metrics is return a self defined collection
 */
Meteor.publish('getPoisMetric', function (/*wsId*/) {
  //var workspace = Workspaces.findOne({_id : wsId});
  //TODO integrate with accounts related impl
  var workspace = Workspaces.findOne();
  return new PoisMetric({ "pois" : workspace.getPois(), "name" : workspace.poiDescriptors});
});

/**
 * Workspace of the User
 */
Meteor.publish('getCurrentWorkspace', function(/*wsId*/) {
  //var workspace = Workspaces.findOne({_id : wsId});
  //TODO integrate with accounts related impl
  var workspace = Workspaces.find(/*{ _id : wsId }*/);
  return workspace;
});
