/*
 * This class handle background processing
 */
Processing = {};

/**
 * Start background processing
 */
Processing.start = function() {
  Processing._authenticateFirebase();
};

/**
 * @private
 */
Processing._authenticateFirebase = function() {
  if (!Meteor.settings.firebase.root) {
    throw new Error("missing-firebase-root",
    "[Processing] Missing firebase URL setting");
  }

  var firebaseRef = new Firebase(Meteor.settings.firebase.root);
  firebaseRef.auth(Meteor.settings.firebase.secret, Meteor.bindEnvironment(function(error, authData) {
    if (error) {
      throw new Error("firebase-authentication-failed",
                      "[Processing] failed to authenticate Firebase",
                      error);
    }
    Workspaces.find().observe({
      "added": function(workspace) {
        Processing._observeWorkspaceEvents(workspace);
      }
    });
  }));
};

Processing._observeWorkspaceEvents = function(workspace) {
  var firebasePaths = workspace.getFirebaseEventPaths();
  var beaconEventsRef = new Firebase(firebasePaths.beaconEvents);
  console.log("[Processing] observing", firebasePaths.beaconEvents);
  beaconEventsRef.on("child_added", Meteor.bindEnvironment(function(snapshot) {
    BeaconEvents.insertFromFBSnapshot(snapshot);
    if (Meteor.settings.firebase.clearFirebaseEvents) {
      snapshot.ref().remove();
    }
  }));
};
