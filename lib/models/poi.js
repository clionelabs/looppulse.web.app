/**
* POI stands for Point Of Interest
*
* Class constructor
* @property {String} id
* @property {String} wsId {@link Workspace}
* @property {String} name
* @property {Object} beacon
*/
Poi = function(doc) {
  _.extend(this, doc);
};

_.extend(Poi.prototype, {
  save: function () {
    var self = this;
    var selector = { _id: self._id };
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
  }
});
