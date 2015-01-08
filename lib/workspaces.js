/**
 * Workspace
 */
Workspaces = new Meteor.Collection('workspaces', {
  transform: function(doc) {
    return new Workspace(doc);
  }
});

if (Meteor.isServer) {
  Workspaces.create = function(name, poiName) {
    var workspace = new Workspace({name: name, poiName: poiName});
    workspace.save();
    return workspace;
  };
}

/**
 *
 * Class constructor
 * @property {String} name
 * @property {String} poiName
 */
Workspace = function(doc) {
  _.extend(this, doc);
};

BaseCollectionModel.inheritFrom(Workspace, Workspaces, ['name', 'poiName']);

if (Meteor.isServer) {
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
}
