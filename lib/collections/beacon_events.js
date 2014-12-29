/**
 * An Meteor collection for beacon events fired from SDK clients.
 *
 * Document property:
 * @property {String} visitorId
 * @property {Doc} beacon {uuid: xxx, major: xxx, minor: xxx}
 * @property {String} sessionId
 * @property {String} type
 * @property {Date} createdAt
**/
BeaconEvents = new Meteor.Collection("beacon_events");

