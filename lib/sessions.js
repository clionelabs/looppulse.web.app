/**
 * Session
 */
Sessions = new Meteor.Collection('sessions', {
  transform: function(doc) {
    return new Session(doc);
  }
});

if (Meteor.isServer) {
  /**
   * Create new Session
   * @param {String} appId {@link Application}
   * @param {String} visitorUUID
   * @param {String} sdk SDK version
   * @param {String} device Mobile device info
   * @return {Session} session
   */
  Sessions.create = function(appId, visitorUUID, sdk, device) {
    var session = new Session({
      appId: appId,
      visitorId: visitorUUID,
      sdk: sdk,
      device: device
    });
    session.save();
    return session;
  };
}

/**
 * Class constructor
 * @property {String} appId {@link Application}
 * @property {String} visitorId {@link Visitor}
 * @property {String} sdk
 * @property {String} device
 * @property {Date} createdAt
 */
Session = function(doc) {
  _.extend(this, doc);
}

if (Meteor.isServer) {
  Session.prototype.save = function() {
    var self = this;
    var selector = {_id: self._id};
    var modifier = {
      $set: {
        appId: self.appId,
        visitorId: self.visitorId,
        sdk: self.sdk,
        device: self.device,
        createdAt: self.createdAt
      }
    }
    var result = Sessions.upsert(selector, modifier);
    if (result.insertedId) {
      self._id = result.insertedId;
    }
    return self._id;
  }
}
