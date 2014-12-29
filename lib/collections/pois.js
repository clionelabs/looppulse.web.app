/**
 * POI stands for Point of Interests
 */
Pois = new Meteor.Collection("pois", {
  transform: function(doc) {
    return new Poi(doc);
  }
});

Pois.findByWsId = function(wsId) {
  return Pois.find({wsId: wsId}).fetch();
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
