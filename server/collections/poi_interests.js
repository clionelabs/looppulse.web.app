/**
 * A journey is classified as interested if it's encounters meet the following criteria:
 *   Within last 30 days, there are at least two encounters, each of which has a duration longer than 5 minutes
  *
  * Document property
  * @property {String} poiId {@link POI}
  * @property {String[]} visitorUUIDs A set of visitor UUID
  */
PoiInterests = new Meteor.Collection('poi_interests');

PoiInterests.THRESHOLD_WITHIN_SEC = 30 * 24 * 60 * 60; // 30 days
PoiInterests.THRESHOLD_DURATION_SEC = 5 * 60; // 5 minutes
PoiInterests.THRESHOLD_ENCOUNTER_COUNT = 2;

PoiInterests.handleChangedJourney = function (journey, oldJourney) {
  var poiId = journey.poiId;
  var visitorUUID = journey.visitorUUID;
  if (PoiInterests.isInterested(journey)) {
    PoiInterests.markInterested(poiId, visitorUUID);
  } else {
    PoiInterests.markNotInterested(poiId, visitorUUID);
  }
};

/*
 * This function determine whether a journey is classified as interested (i.e. a visitor interested in a poi)
 *
 * @param {Journey} journey
 * @returns {Boolean} isInterested
 */
PoiInterests.isInterested = function (journey) {
  var current = moment();
  var validCount = _.reduce(journey.encounters, function(memo, encounter) {
    if (moment(current).diff(encounter.enteredAt) < PoiInterests.THRESHOLD_WITHIN_SEC * 1000
        && encounter.duration(current) >= PoiInterests.THRESHOLD_DURATION_SEC * 1000) {
      memo++;
    }
    return memo;
  }, 0);
  return validCount >= PoiInterests.THRESHOLD_ENCOUNTER_COUNT;
};

PoiInterests.markInterested = function (poiId, visitorUUID) {
  PoiInterests.upsert({poiId: poiId}, {$addToSet: {visitorUUIDs: visitorUUID}});
};

PoiInterests.markNotInterested = function (poiId, visitorUUID) {
  PoiInterests.upsert({poiId: poiId}, {$pull: {visitorUUIDs: visitorUUID}});
};

Meteor.startup(function() {
  Journeys.find().observe({
    _suppress_initial: true,
    "changed": PoiInterests.handleChangedJourney
  });

  Pois.find().observe({
    "removed": function(poi) {
      PoiInterests.remove({poiId: poi._id});
    }
  });
});
