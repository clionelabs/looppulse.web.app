/**
 * Here defines every publication.
 */

Meteor.publish("poiMetric", function (poiId) {
  return new PoiMetric({ "poiId" : poiId });
});

/**
 * Poi Metrics is return a self defined collection
 */
Meteor.publish('poisMetric', function (workspaceId) {
  return new PoisMetric({ "workspaceId" : workspaceId });
});

/**
 * Workspace And Organization of the User
 */
Meteor.publish('currentWorkspaceAndOrganization', function() {
  if (this.userId) {
    var organization = Organizations.findByUserId(this.userId);
    var workspace = Workspaces.find({organizationId: organization.fetch()[0]._id});
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
