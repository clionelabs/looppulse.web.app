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

  Meteor.startup(function() {
    Applications.find().observe({
      "removed": function(application) {
        Sessions.remove({appId: application._id});
      }
    });
  });
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

BaseCollectionModel.inheritFrom(Session, Sessions, ['appId', 'visitorId', 'sdk', 'device', 'createdAt']);
