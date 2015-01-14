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
Captures = new Meteor.Collection('captures', {
  transform: function(doc) {
    return new Capture(doc);
  }
});

Capture = function(doc) {
  _.extend(this, doc);
}
