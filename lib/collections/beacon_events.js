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
BeaconEvents = new Meteor.Collection('beacon_events', {
  transform: function(doc) {
    return new BeaconEvent(doc);
  }
});

if (Meteor.isServer) {
  /**
   * Insert a beacon event given a firebase snapshot
   *
   * @param {Object} snapshot Firebase snapshot
   **/
  BeaconEvents.insertFromFBSnapshot = function(snapshot) {
    var key = snapshot.ref().toString().split(/\//).pop();

    if (BeaconEvents.findOne({key: key})) {
      console.warn("[BeaconEvents] event already inserted");
      return;
    }

    var eventJSON = snapshot.val();
    var visitorUUID = eventJSON.visitor_uuid;
    var sessionId = eventJSON.session_id;
    var type = eventJSON.type;
    var beacon = {
      uuid: eventJSON.uuid,
      major: eventJSON.major,
      minor: eventJSON.minor
    }
    var createdAt = Date.parse(eventJSON.created_at);
    var doc = {
      key: key,
      visitorUUID: visitorUUID,
      sessionId: sessionId,
      beacon: beacon,
      type: type,
      createdAt: createdAt
    };
    console.log("[BeaconEvents] inserting doc: ", JSON.stringify(doc));
    BeaconEvents.insert(doc);
  }
}

BeaconEvent = function(doc) {
  _.extend(this, doc);
}

BeaconEvent.prototype.isEnter = function() {
  return this.type === 'didEnterRegion';
}

BeaconEvent.prototype.isExit = function() {
  return this.type === 'didExitRegion';
}
