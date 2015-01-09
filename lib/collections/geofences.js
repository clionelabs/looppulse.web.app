/**
 * GeoFence for workspaces
 *
 * Document property
 * @property {String} wsId {@link Workspace}
 * @property {Float} lat Latitude
 * @property {Float} lng Longitude
 * @property {Float} radius Radius in meters
 */
Geofences = new Meteor.Collection("geofences", {
  transform: function(doc) {
    return new Geofence(doc);
  }
});

Geofence = function(doc) {
  _.extend(this, doc);
};
