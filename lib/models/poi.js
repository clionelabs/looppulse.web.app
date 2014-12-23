/**
 * Poi stands for Point Of Interest
 *
 * Class constructor
 * @property {String} id
 * @property {String} wsId {@link Workspace}
 * @property {String} name
 * @property {Object} beacon
 */
Poi = function() {
  this.id = null;
  this.wsId = null;
  this.name = null;
  this.beacon = null
}

Poi.prototype.init = function(wsId, name, beacon) {
  this.wsId = wsId;
  this.name = name;
  this.beacon = beacon;
}

Poi.prototype.initFromDoc = function(doc) {
  this.init(doc.wsId, doc.name, doc.beacon);
  this.id = doc._id;
}

Poi.prototype.save = function() {
  var selector = {_id: this.id};
  var modifier = {
    $set: {
      wsId: this.wsId,
      name: this.name,
      beacon: this.beacon
    }
  }
  var result = Pois.upsert(selector, modifier);
  if (result.insertedId) {
    this._id = result.insertedId;
  } else {
    this._id = Pois.findOne(selector)._id;
  }
  return this._id;
}
