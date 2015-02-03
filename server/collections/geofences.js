/**
 *  Server extension for geofences.js
 */
Meteor.startup(function() {
  Workspaces.find().observe({
    "removed": function(workspace) {
      Geofences.remove({workspaceId: workspace._id});
    }
  });
  Geofences._ensureIndex({workspaceId: 1});
});
