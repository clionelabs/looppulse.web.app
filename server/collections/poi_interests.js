/**
  * This is a temporary solution for storing POI interested visitor.
  * Whenever there is a new beacon event, we probabilistically put/remove the visitor from the poi interested list.
  *
  * Document property
  * @property {String} poiId {@link POI}
  * @property {SET<String>} visitorUUIDs A set of visitor UUID
  */
PoiInterests = new Meteor.Collection('poi_interests');

Meteor.startup(function() {
  Journeys.find().observe({
    _suppress_initial: true,
    "changed": function(newJourney, oldJourney) {
      var poiId = newJourney.poiId;
      var visitorUUID = newJourney.visitorUUID;
      if (Math.random() <= 0.2) {
        PoiInterests.upsert({poiId: poiId}, {$addToSet: {visitorUUIDs: visitorUUID}});
      } else {
        PoiInterests.upsert({poiId: poiId}, {$pull: {visitorUUIDs: visitorUUID}});
      }
    }
  });

  Pois.find().observe({
    "removed": function(poi) {
      PoiInterests.remove({poiId: poi._id});
    }
  });
});
