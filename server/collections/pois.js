/**
 * Server extension for pois.js
 */
Meteor.startup(function() {
  Workspaces.find().observe({
    "removed": function(workspace) {
      Pois.remove({wsId: workspace._id});
    }
  });
  Pois._ensureIndex({wsId: 1});
});

