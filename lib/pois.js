/**
 * POI stands for Point of Interests
 */
Pois = new Meteor.Collection("pois", {
  transform: function(doc) {
    return new Poi(doc);
  }
});

if (Meteor.isServer) {
  Pois.create = function(wsId, name, beacon) {
    var poi = new Poi({wsId: wsId, name: name, beacon: beacon});
    poi.save();
    return poi;
  };
}

/**
*
* Class constructor
* @property {String} wsId {@link Workspace}
* @property {String} name
* @property {Object} beacon
*/
Poi = function(doc) {
  _.extend(this, doc);
};

if (Meteor.isServer) {
  Poi.prototype.save = function() {
    var self = this;
    var selector = {_id: self._id};
    var modifier = {
      $set: {
        wsId: self.wsId,
        name: self.name,
        beacon: self.beacon
      }
    }
    var result = Pois.upsert(selector, modifier);
    if (result.insertedId) {
      self._id = result.insertedId;
    }
    return self._id;
  };
}
