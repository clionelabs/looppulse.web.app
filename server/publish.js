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
  var pois = Pois.find({ "wsId" : workspace._id}).fetch();
  return new PoisMetric({ "pois" : pois, "name" : workspace.poiName});
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