/**
 * Here defines every publication.
 */

Meteor.publish("pois", function (workspaceId) {
  return Pois.find({ workspaceId : workspaceId });
});

/**
 * Poi Metrics is return a self defined collection
 */
Meteor.publish('poisMetric', function (workspaceId) {
  var workspace = Workspaces.findOne({ _id : workspaceId });
  var pois = workspace.getPois();
  var poiDescriptors = workspace.poiDescriptors;
  return new PoisMetric({ "pois" : pois, "name" : poiDescriptors});
});

/**
 * Workspace And Organization of the User
 */
Meteor.publish('currentWorkspaceAndOrganization', function() {
  console.log(this.userId);
  if (this.userId) {
    var organization = Organizations.findByUserId(this.userId);
    var workspace = Workspaces.find({organizationId: organization._id});
    return [organization, workspace];
  } else {
    return [];
  }
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
