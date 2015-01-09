/**
 *  Server extension for geofences.js
 */
Meteor.startup(function() {
  Workspaces.find().observe({
    "removed": function(workspace) {
      Geofences.remove({wsId: workspace._id});
    }
  });
  Geofences._ensureIndex({wsId: 1});
});
