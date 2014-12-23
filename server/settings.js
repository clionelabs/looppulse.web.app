/**
 * Server (default) settings
 */
Settings = {
  firebase: {
    beacon_events: null,
  },
  clearFirebaseEvents: true,
  loadFixtures: false
};

Settings.load = function(customSettings) {
  _.extend(Settings, customSettings);

  // Required fields:
  if (Settings.firebase.beacon_events === null) {
    console.error("[Settings] Missing firebase.beaconEvents");
  }
}
