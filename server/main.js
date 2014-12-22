// Start background processing
Processing.start();

// Reload fixtures
if (Meteor.settings.loadFixtures) {
  Fixtures.reload();
}
