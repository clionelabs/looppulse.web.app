/**
 * Meteor collection for visit.
 *
 * A visit object contains a list of ENTER|EXIT events happend between a particular POI for a particular visitor.
 * The objective of this class is to provide an intermediate layer between the noisy beaconEvents and metrics computation.
 *
 * In short, raw beacon events are noisy in the following senses:
 *   1) Mobile devices (mainly IOS) generates a whole bunch of raw ENTER and EXIT events even though the person stays within the beacon region.
 *   2) Invalid events appears. e.g. an ENTER event followed by another ENTER event without ever EXIT.
 *
 * The internal implemetation of this class will:
 *   1) Combine multiple events into one, if they happen within a grace period.
 *   2) Filter out invalid events
 *
 * Therefore, it's a safe to assume the followings to the constructed events list:
 *   1) The events list will always be of the form [ENTER -> EXIT -> ENTER -> EXIT -> ...]
 *   2) The events list is in chronological order.
 *   3) A pair of ENTER -> EXIT is a single encounter (meaning that the visitor has arrived and left a beacon region)
 *   4) If the last event is an ENTER, then the visitor is currently inside the poi region.
 *
 * Document property:
 * @property {String} visitorUUID
 * @property {String} poiId
 * @property {Object[]} events Each event is of the form {type: xxx, at: yyy}
**/
Visits = new Meteor.Collection('visits', {
  transform: function(doc) {
    return new Visit(doc);
  }
});

Visits.ENTER = 0;
Visits.EXIT = 1;

/**
 * Return the last event of an visit
 * @param {String} poiId
 * @param {String} visitorUUID
 * @return {Object} event
 */
Visits.findLastEvent = function(poiId, visitorUUID) {
  var doc = Visits.findOne({poiId: poiId, visitorUUID: visitorUUID}, {fields: {events: {$slice: -1}}});
  if (doc === undefined) return null;
  return doc.events[0];
};

/**
 * Insert an event into a visit; Create the visit if not already existed
 * @param {String} poiId
 * @param {String} visitorUUID
 * @paran {Object} e
 */
Visits.insertEvent = function(poiId, visitorUUID, e) {
  var selector = {poiId: poiId, visitorUUID: visitorUUID};
  var modifier = {
    $setOnInsert: {poiId: poiId, visitorUUID: visitorUUID},
    $push: {events: e}
  };
  Visits.upsert(selector, modifier);
};

/**
 * Remove the last event of a visit
 * @param {String} poiId
 * @param {String} visitorUUID
 */
Visits.removeLastEvent = function(poiId, visitorUUID) {
  var selector = {poiId: poiId, visitorUUID: visitorUUID};
  var modifier = {
    $pop: {events: 1}
  }
  Visits.update(selector, modifier);
};

/**
 * Update the events list of a visit object according to the follwing logic:
 *   1) the event list always started with ENTER
 *   2) an ENTER is always followed by an EXIT, and vice versa
 *   3) if an ENTER happens within a grace period from the last EXIT, then the current ENTER and the last EXIT are just noise.
 *
 * @param {BeaconEvent} beaconEvent
 */
Visits.handleNewBeaconEvent = function(beaconEvent) {
  var poi = Pois.findOne({beacon: beaconEvent.beacon});
  if (poi === undefined) {
    console.warn("[Visits] poi not found for beacon: ", beaconEvent.beacon);
    return;
  }

  var lastEvent = Visits.findLastEvent(poi._id, beaconEvent.visitorUUID);
  var newEvent = {
    type: (beaconEvent.type === 'didEnterRegion'? Visits.ENTER: Visits.EXIT),
    at: beaconEvent.createdAt
  };
  var lastEventTime = moment(lastEvent.at);
  var newEventTime = moment(newEvent.at);

  // If no previous event, then expect the first one to be ENTER
  if (lastEvent === null) { // If no previous event, then expect the first one to be ENTER
    if (newEvent.type === Visits.ENTER) {
      Visits.insertEvent(poi._id, beaconEvent.visitorUUID, newEvent);
    }
  }
  // The new event is a valid one only if it's different from the previous one, and happens after
  else if (newEvent.type !== lastEvent.type && lastEventTime.isBefore(newEventTime)) {
    if (newEvent.type === Visits.ENTER) {
      // If within grace period, then just remove the last EXIT, otherwise, it's a new one
      if (moment(lastEventTime).add(Settings.visitGraceInSec, 's').isBefore(newEventTime)) {
        Visits.removeLastEvent(poi._id, beaconEvent.visitorUUID);
      } else {
        Visits.insertEvent(poi._id, beaconEvent.visitorUUID, newEvent);
      }
    } else {
      // Normal case, ENTER followed by EXIT
      Visits.insertEvent(poi._id, beaconEvent.visitorUUID, newEvent);
    }
  }
};

Visit = function(doc) {
  _.extend(this, doc);
}

Meteor.startup(function() {
  BeaconEvents.find().observe({
    _suppress_initial: true,
    "added": function(beaconEvent) {
      Visits.handleNewBeaconEvent(beaconEvent);
    }
  });
});
