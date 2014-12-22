/**
 * Session
 *
 * Class constructor
 * @property {String} id
 * @property {String} visitorId {@link Visitor}
 * @property {String} sdk
 * @property {String} device
 * @property {Date} createdAt
 */
Session = function() {
  this.id = null;
  this.visitorId = null;
  this.sdk = null;
  this.device = null;
  this.createdAt = null;
}

Session.prototype.init = function(appId, visitorId, sdk, device, createdAt) {
  this.appId = appId;
  this.visitorId = visitorId;
  this.sdk = sdk;
  this.device = device;
  this.createdAt = createdAt;
}

Session.prototype.initFromDoc = function(doc) {
  this.init(doc.visitorId, doc.sdk, doc.device, doc.createdAt);
  this.id = doc._id;
}

Session.prototype.save = function() {
  var selector = {_id: this.id};
  var modifier = {
    $set: {
      visitorId: this.visitorId,
      sdk: this.sdk,
      device: this.device,
      createdAt: this.createdAt
    }
  }
  var result = Sessions.upsert(selector, modifier);
  if (result.insertedId) {
    this._id = result.insertedId;
  } else {
    this._id = Session.findOne(selector)._id;
  }
  return this._id;
}
