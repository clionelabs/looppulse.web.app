// System wide configuration
System.configure();

// Start background processing
Processing.start();

// Re-compute Interests
if (true) {
  Journeys.find().forEach(function(journey) {
    var poiId = journey.poiId;
    var visitorUUID = journey.visitorUUID;
    if (PoiInterests.isInterested(journey)) {
      PoiInterests.markInterested(poiId, visitorUUID);
    } else {
       PoiInterests.markNotInterested(poiId, visitorUUID);
    }
  });
}
