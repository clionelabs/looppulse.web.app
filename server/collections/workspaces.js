/*
 * Server extension for workspaces.js
 */
Workspace.prototype.getFirebaseRoot = function() {
  return Meteor.settings.firebase.root + "/workspaces/" + this._id;
}

Workspace.prototype.getFirebaseEventPaths = function() {
  var firebaseRoot = this.getFirebaseRoot();
  var beaconEventsPath = firebaseRoot + "/" + Meteor.settings.firebase.paths.beaconEvents;
  var visitorEventsPath = firebaseRoot + "/" + Meteor.settings.firebase.paths.visitorEvents;
  return {
    beaconEvents: beaconEventsPath,
    visitorEvents: visitorEventsPath
  }
}

Workspace.prototype.getGeofences = function() {
  return Geofences.find({workspaceId: this._id}).fetch();
}

Meteor.startup(function() {
  Organizations.find().observe({
    "removed": function(organization) {
      Workspaces.remove({organizationId: organization._id});
    }
  });
});
