/**
 * Session
 *
 * Document property
 * @property {String} appId {@link Application}
 * @property {String} visitorUUID
 * @property {String} sdk
 * @property {String} device
 * @property {Date} createdAt
 */
Sessions = new Meteor.Collection('sessions', {
  transform: function(doc) {
    return new Session(doc);
  }
});

Session = function(doc) {
  _.extend(this, doc);
}
