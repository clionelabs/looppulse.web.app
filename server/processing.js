/*
 * This class handle background processing
 */
Processing = {};

/**
 * Start background processing
 */
Processing.start = function() {
  Processing._observeBeaconEvents();
}

/**
 * @private
 * Observe beacon events from firebase and insert them into DB
 */
Processing._observeBeaconEvents = function() {
  var firebaseRef = new Firebase(Meteor.settings.firebase.beacon_events);
  firebaseRef.on("child_added", Meteor.bindEnvironment(function(snapshot) {
    BeaconEvents.insertFromFBSnapshot(snapshot);
    if (Meteor.settings.clearFirebaseEvents) {
      snapshot.ref().remove();
    }
  }));
}
