/*
 * This class handle background processing
 */
Processing = {};

/**
 * Start background processing
 */
Processing.start = function() {
  Processing._authenticateFirebase();
}

/**
 * @private
 */
Processing._authenticateFirebase = function() {
  var firebaseRef = new Firebase(Settings.firebase.root);
  firebaseRef.auth(Settings.firebase.secret, Meteor.bindEnvironment(function(error, authData) {
    if (error) {
      console.error("[Processing] failed to authenticate firebase. Error: ", error);
    } else {
      Workspaces.find().observe({
        "added": function(workspace) {
          Processing._observeWorkspaceEvents(workspace);
        }
      });
    }
  }));
}

Processing._observeWorkspaceEvents = function(workspace) {
  var firebasePaths = workspace.getFirebaseEventPaths();
  var beaconEventsRef = new Firebase(firebasePaths.beaconEvents);
  console.log("[Processing] observing", firebasePaths.beaconEvents);
  beaconEventsRef.on("child_added", Meteor.bindEnvironment(function(snapshot) {
    BeaconEvents.insertFromFBSnapshot(snapshot);
    if (Settings.clearFirebaseEvents) {
      snapshot.ref().remove();
    }
  }));
}
