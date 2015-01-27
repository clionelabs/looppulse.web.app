/**
 *  Server extension on lib/collections/beacon_events.js
 *
 */

/*
 * Insert a beacon event given a firebase snapshot
 *
 * @param {Object} snapshot Firebase snapshot
 **/
BeaconEvents.insertFromFBSnapshot = function(snapshot) {
  var eventJSON = snapshot.val();
  var doc = {
    createdAt: Date.parse(eventJSON.created_at),
    type: eventJSON.type,
    captureId: eventJSON.capture_id,
    visitorUUID: eventJSON.visitor_uuid,
    beacon: {
      uuid: eventJSON.uuid.toLowerCase(),
      major: eventJSON.major,
      minor: eventJSON.minor
    }
  };
  BeaconEvents.insert(doc);
}
