/**
 * Poi stands for Point Of Interest
 *
 * Class constructor
 * @property {String} id
 * @property {String} appId {@link Application}
 * @property {String} name
 * @property {Beacon} beacon
 */
Poi = function() {
  this.id = null;
  this.appId = null;
  this.name = null;
  this.beacon = null
}

Poi.prototype.init = function(appId, name, beacon) {
  this.appId = appId;
  this.name = name;
  this.beacon = beacon;
}

Poi.prototype.initFromDoc = function(doc) {
  this.init(doc.appId, doc.name, doc.beacon);
  this.id = doc._id;
}

Poi.prototype.save = function() {
  var selector = {_id: this.id};
  var modifier = {
    $set: {
      appId: this.appId,
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
