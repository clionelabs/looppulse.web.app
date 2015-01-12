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

if (Meteor.isServer) {
  Geofence.prototype.save = function() {
    var self = this;
    var selector = {_id: self._id};
    var modifier = {
      $set: {
        wsId: self.wsId,
        lat: self.lat,
        lng: self.lng,
        radius: self.radius
      }
    }
    var result = Geofences.upsert(selector, modifier);
    if (result.insertedId) {
      self._id = result.insertedId;
    }
    return self._id;
  };
}

