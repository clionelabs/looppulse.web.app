/**
 * Server extension on lib/collections/journeys.js
 *
 * For class documentation, refer to lib/collections.journeys.js
 */

Journeys.GRACE_PERIOD_IN_SEC = 60; // Grace period to determine whether a new ENTER event is a real encounter, or just noise as part of the previous.

/**
 * @private
 * Find the last encounter from a Journey's encounter list
 */
Journeys._findLastEncounter = function(poiId, visitorUUID) {
  var doc = Journeys.findOne({poiId: poiId, visitorUUID: visitorUUID}, {fields: {encounters: {$slice: -1}}});
  if (!doc || !doc.encounters) return null;
  return doc.encounters[0];
};

/**
 * @private
 * Remove the last encounter from a Journey's encounter list
 */
Journeys._popEncounter = function(poiId, visitorUUID) {
  var selector = {poiId: poiId, visitorUUID: visitorUUID};
  var modifier = {
    $pop: {encounters: 1}
  }
  Journeys.update(selector, modifier);
};

/**
 * @private
 * Push a new encounter to the end of a Journey's encounter list
 */
Journeys._pushEncounter = function(poiId, visitorUUID, enteredAt, exitedAt) {
  var newEncounter = {
    enteredAt: enteredAt,
    exitedAt: exitedAt,
    duration: (exitedAt? moment(exitedAt).diff(moment(enteredAt), 's'): null)
  }

  var selector = {poiId: poiId, visitorUUID: visitorUUID};
  var modifier = {
    $setOnInsert: {poiId: poiId, visitorUUID: visitorUUID},
    $push: {encounters: newEncounter}
  };
  Journeys.upsert(selector, modifier);
};

/**
 * @private
 * Push a new encounter to the end of a Journey's encounter list
 */
Journeys._openEncounter = function(poiId, visitorUUID, enteredAt) {
  Journeys._pushEncounter(poiId, visitorUUID, enteredAt, null);
};

/**
 * @private
 * Close the last opened encounter
 */
Journeys._closeLastEncounter = function(poiId, visitorUUID, exitedAt) {
  var lastEncounter = Journeys._findLastEncounter(poiId, visitorUUID);
  Journeys._popEncounter(poiId, visitorUUID);
  Journeys._pushEncounter(poiId, visitorUUID, lastEncounter.enteredAt, exitedAt);
};

/**
 * @private
 * Reopen the last closed encounter
 */
Journeys._reopenLastEncounter = function(poiId, visitorUUID) {
  var lastEncounter = Journeys._findLastEncounter(poiId, visitorUUID);
  Journeys._popEncounter(poiId, visitorUUID);
  Journeys._pushEncounter(poiId, visitorUUID, lastEncounter.enteredAt, null);
};

/**
 * Handle new incoming beaconEvent
 * @param {BeaconEvent} beaconEvent
 */
Journeys.handleNewBeaconEvent = function(beaconEvent) {
  // Make sure the corresponding POI exists
  var poi = Pois.findOne({beacon: beaconEvent.beacon});
  if (poi === undefined) {
    console.warn("[Journeys] poi not found for beacon: ", beaconEvent.beacon);
    return;
  }

  var poiId = poi._id;
  var visitorUUID = beaconEvent.visitorUUID;
  var at = beaconEvent.createdAt;
  var lastEncounter = Journeys._findLastEncounter(poiId, visitorUUID);

  // There are six cases (2 x 3):
  // 1) new event is i) ENTER, or ii) EXIT
  // 2) last encounter is i) doesn' exists, ii) opened encounter, iii) closed encounter
  if (beaconEvent.isEnter()) { // new ENTER event
    if (lastEncounter === null) { // no previous encounters
      Journeys._openEncounter(poiId, visitorUUID, at);
    }
    else if (lastEncounter.exitedAt === null) { // previous encounter is not closed
      // This is an unexpected event, because we would expect a EXIT event to close the previous encounter.
      // We assume the the EXIT event is missed, so we simply remove the previous opening encounter, and start over with a new one.
      Journeys._popEncounter(poiId, visitorUUID);
      Journeys._openEncounter(poiId, visitorUUID, at);
    }
    else { // previous encounter is closed
      // We check whether the event happens within a grace period from last closed encounter.
      // If yes, then we consider it as noise and reopen the last encounter
      if (moment(lastEncounter.exitedAt).add(Journeys.GRACE_PERIOD_IN_SEC, 's').isAfter(at)) {
        Journeys._reopenLastEncounter(poiId, visitorUUID);
      }
      // Otherwise, it's a new encounter
      else {
        Journeys._openEncounter(poiId, visitorUUID, at);
      }
    }
  }
  else if (beaconEvent.isExit()) { // new EXIT event
    if (lastEncounter === null) { // no previous encounters
      // We expect the first event to be ENTER, so we might have missed that.
      // We can't recover the missing event and The best we can do here is to ignore this EXIT.
    }
    else if (lastEncounter.exitedAt === null) { //previous encounter is opened
      // This is the standard case, ENTER event followed by EXIT
      Journeys._closeLastEncounter(poiId, visitorUUID, at);
    }
    else { // previous encounter is closed
      // Since last encounter is already closed, so we do not expect a EXIT event before we receive an ENTER
      // We might have missed an ENTER event, so the best we can do here is to ignore this EXIT.
    }
  }
};

Meteor.startup(function() {
  BeaconEvents.find().observe({
    _suppress_initial: true,
    "added": function(beaconEvent) {
      Journeys.handleNewBeaconEvent(beaconEvent);
    }
  });
});
