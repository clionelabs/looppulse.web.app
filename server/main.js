// Override default settings
Settings.load(Meteor.settings);

// Start background processing
Processing.start();

// Reload fixtures
if (Settings.loadFixtures) {
  Fixtures.reload();
}
