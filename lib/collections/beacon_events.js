/**
 * An Meteor collection for beacon events fired from SDK clients.
 * Note: This class currently doesn't contain a corresponding model objects; Beacon Events are stored in pure document format
 *
 * Document property:
 * @property {String} visitorId
 * @property {Doc} beacon {uuid: xxx, major: xxx, minor: xxx}
 * @property {String} sessionId
 * @property {0|1} delta {0 - exit, 1 - enter}e
 * @property {Date} createdAt
**/
BeaconEvents = new Meteor.Collection("beacon_events");

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
  var beacon = {
    uuid: eventJSON.uuid,
    major: eventJSON.major,
    minor: eventJSON.minor
  }
  var type = eventJSON.type;
  if (type !== "didEnterRegion" && type !== "didExitRegion") {
    throw "Invalid beacon type";
  }
  var delta = (type === 'didEnterRegion'? 1: 0);
  var createdAt = Date.parse(eventJSON.created_at);
  var doc = {
    key: key,
    visitorUUID: visitorUUID,
    sessionId: sessionId,
    beacon: beacon,
    delta: delta,
    createdAt: createdAt
  };
  console.log("[BeaconEvents] inserting doc: ", JSON.stringify(doc));
  BeaconEvents.insert(doc);
}
