/**
 * Visitor is a unique combination of workspace and device UUID
 *
 * Class constructor
 * @property {String} id
 * @property {String} wsId {@link Workspace}
 * @property {String} uuid Unique identifier per device (expecting Advertising ID)
 * @property {String} externalId Custom id for client's application (e.g. userId in their own membership system)
 */
Visitor = function() {
  this.id = null;
  this.wsId = null;
  this.uuid = null;
  this.externalId = null;
}

Visitor.prototype.init = function(wsId, uuid, externalId) {
  this.wsId = wsId;
  this.uuid = uuid;
  this.externalId = externalId;
}

Visitor.prototype.initFromDoc = function(doc) {
  this.init(doc.wsId, doc.uuid, doc.externalId);
  this.id = doc._id;
}

Visitor.prototype.save = function() {
  var selector = {_id: this.id};
  var modifier = {
    $set: {
      wsId: this.wsId,
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
