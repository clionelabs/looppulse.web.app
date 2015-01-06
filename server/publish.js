/**
 * Here defines every publication.
 */

Meteor.publish('getPoisMetric', function (/*wsId*/) {
  //var workspace = Workspaces.findOne({_id : wsId});
  //TODO integrate with accounts related impl
  var workspace = Workspaces.findOne();
  var pois = Pois.find({ "wsId" : workspace._id}).fetch();
  return new PoisMetric({ "pois" : pois, "name" : workspace.poiName});
});