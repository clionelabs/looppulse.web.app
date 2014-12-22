/**
 * Visitor is a unique combination of application and device UUID
 *
 * Class constructor
 * @property {String} id
 * @property {String} appId {@link Application}
 * @property {String} uuid Unique identifier per device (expecting Advertising ID)
 * @property {String} externalId Custom id for client's application (e.g. userId in their own membership system)
 */
Visitor = function() {
  this.id = null;
  this.appId = null;
  this.uuid = null;
  this.externalId = null;
}

Visitor.prototype.init = function(appId, uuid, externalId) {
  this.appId = appId;
  this.uuid = uuid;
  this.externalId = externalId;
}

Visitor.prototype.initFromDoc = function(doc) {
  this.init(doc.appId, doc.uuid, doc.externalId);
  this.id = doc._id;
}

Visitor.prototype.save = function() {
  var selector = {_id: this.id};
  var modifier = {
    $set: {
      appId: this.appId,
      uuid: this.uuid,
      externalId: this.externalId
    }
  }
  var result = Visitors.upsert(selector, modifier);
  if (result.insertedId) {
    this._id = result.insertedId;
  } else {
    this._id = Visitor.findOne(selector)._id;
  }
  return this._id;
}
