/**
 * Captures serve two purposes:
 *   1) Capture device information (e.g. sdk and device model) of visitor.
 *   2) Associate the information with events submitted from sdk. e.g. captureId will be included in the beacon events sent from devices.
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
