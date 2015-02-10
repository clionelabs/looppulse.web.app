/**
  * This is a temporary solution for storing POI interested visitor.
  * Whenever there is a new beacon event, we probabilistically put/remove the visitor from the poi interested list.
  *
  * Document property
  * @property {String} poiId {@link POI}
  * @property {String[]} visitorUUIDs A set of visitor UUID
  */
PoiInterests = new Meteor.Collection('poi_interests');

PoiInterests.handleChangedJourney = function (journey, oldJourney) {
  var poiId = journey.poiId;
  var visitorUUID = journey.visitorUUID;
  if (PoiInterests.isInterested(journey)) {
    PoiInterests.markInterested(poiId, visitorUUID);
  } else {
    PoiInterests.markNotInterested(poiId, visitorUUID);
  }
};

PoiInterests.isInterested = function (journey) {
  // HACK: interested if it's the second time there
  return (journey.encounters.length > 1);
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
