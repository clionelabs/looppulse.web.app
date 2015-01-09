// Override default settings
Settings.load(Meteor.settings);

// Start background processing
Processing.start();


Meteor.startup(function() {
  UserAccount.startup();
})

// Reload fixtures
if (Settings.loadFixtures) {
  Fixtures.reload();
}
