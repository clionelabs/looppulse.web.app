/**
 * GeoFences for workspaces
 */
Geofences = new Meteor.Collection("geofences", {
  transform: function(doc) {
    return new Geofence(doc);
  }
});

if (Meteor.isServer) {
  Geofences.create = function(wsId, lat, lng, radius) {
    var geofence = new Geofence({wsId: wsId, lat: lat, lng: lng, radius: radius});
    geofence.save();
    return geofence;
  };

  Meteor.startup(function() {
    Workspaces.find().observe({
      "removed": function(workspace) {
        Geofences.remove({wsId: workspace._id});
      }
    });
  });
}

/**
*
* Class constructor
* @property {String} wsId {@link Workspace}
* @property {Float} lat Latitude
* @property {Float} lng Longitude
* @property {Float} radius Radius in meters
*/
Geofence = function(doc) {
  _.extend(this, doc);
};

BaseCollectionModel.inheritFrom(Geofence, Geofences, ['wsId', 'lat', 'lng', 'radius']);
