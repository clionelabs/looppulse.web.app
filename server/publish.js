/**
 * Here defines every publication.
 */

Meteor.publish("getPois", function () {
  var workspace = Workspaces.findOne();
  return Pois.find({ workspaceId : workspace._id });
});

/**
 * Poi Metrics is return a self defined collection
 */
Meteor.publish('getPoisMetric', function () {
  var workspace = Workspaces.findOne();
  var pois = workspace.getPois();
  var poiDescriptors = workspace.poiDescriptors;
  return new PoisMetric({ "pois" : pois, "name" : poiDescriptors});
});

/**
 * Workspace of the User
 */
Meteor.publish('getCurrentWorkspace', function(/*workspaceId*/) {
  //var workspace = Workspaces.findOne({_id : workspaceId});
  //TODO integrate with accounts related impl
  var workspace = Workspaces.find(/*{ _id : workspaceId }*/);
  return workspace;
});

/**
 * Always publish logged-in user's organizationIds for client-side fast checking
 */
Meteor.publish(null, function () {
  var userId = this.userId;
  return Meteor.users.find({_id:userId});
});

Meteor.publish('organizations', function (userId) {
  return Organizations.findByUserId(userId);
});
