/**
 * Server (default) settings
 */
Settings = {
  firebase: {
    root: null,
    secret: null,
    paths: {
      beaconEvents: null
    }
  },
  clearFirebaseEvents: true,
  loadFixtures: false,
  visitGraceInSec: 60
};

Settings.load = function(customSettings) {
  _.extend(Settings, customSettings);

  // Required fields:
  if (Settings.firebase.root === null) {
    console.error("[Settings] Missing firebase settings");
  }
}
