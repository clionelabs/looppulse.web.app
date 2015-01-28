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

/**
 * Always publish logged-in user's organizationIds for client-side fast checking
 */
Meteor.publish(null, function () {
  var userId = this.userId;
  return Meteor.users.find({_id:userId});
});



// List all the organization that current user can access (minimum data)
Meteor.publish('accessible-organizations', function () {
  var userId = this.userId;
  return Organizations.findByUserId(userId, {fields: { _id:1, name:1 }});
});

// Provide organization users list when only needed (Demo of Org Access)
Meteor.publish('organizations-users', function (organizationId) {
  var userId = this.userId;
  return Organizations.findById(organizationId, userId, {fields: { _id:1, name:1, userIds:1 }});
});