/**
 * Session
 */
Sessions = new Meteor.Collection('sessions', {
  transform: function(doc) {
    return new Session(doc);
  }
});

/**
 * Class constructor
 * @property {String} wsId {@link Workspace}
 * @property {String} visitorId {@link Visitor}
 * @property {String} sdk
 * @property {String} device
 * @property {Date} createdAt
 */
Session = function(doc) {
  _.extend(this, doc);
}

Session.prototype.save = function() {
  var self = this;
  var selector = {_id: self._id};
  var modifier = {
    $set: {
      wsId: self.wsId,
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
