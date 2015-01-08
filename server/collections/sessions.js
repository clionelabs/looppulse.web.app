/**
 * Server extension for sessions.js
 */
Meteor.startup(function() {
  Applications.find().observe({
    "removed": function(application) {
      Sessions.remove({appId: application._id});
    }
  });
});
