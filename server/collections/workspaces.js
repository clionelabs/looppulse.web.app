/*
 * Server extension for workspaces.js
 */
Workspace.prototype.getFirebaseRoot = function() {
  return Settings.firebase.root + "/workspaces/" + this._id;
}

Workspace.prototype.getFirebaseEventPaths = function() {
  var firebaseRoot = this.getFirebaseRoot();
  var beaconEventsPath = firebaseRoot + "/" + Settings.firebase.paths.beaconEvents;
  var visitorEventsPath = firebaseRoot + "/" + Settings.firebase.paths.visitorEvents;
  return {
    beaconEvents: beaconEventsPath,
    visitorEvents: visitorEventsPath
  }
}

Workspace.prototype.getPois = function() {
  return Pois.find({wsId: this._id}).fetch();
}

Workspace.prototype.getGeofences = function() {
  return Geofences.find({wsId: this._id}).fetch();
}
