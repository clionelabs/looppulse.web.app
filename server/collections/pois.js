/**
 * Server extension for pois.js
 */
Meteor.startup(function() {
  Workspaces.find().observe({
    "removed": function(workspace) {
      Pois.remove({workspaceId: workspace._id});
    }
  });
  Pois._ensureIndex({workspaceId: 1});
});

