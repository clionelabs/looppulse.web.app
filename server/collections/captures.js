/**
 * Server extension for sessions.js
 */
Meteor.startup(function() {
  Applications.find().observe({
    "removed": function(application) {
      Captures.remove({appId: application._id});
    }
  });
});
