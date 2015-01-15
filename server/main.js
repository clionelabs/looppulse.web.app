// Override default settings
Settings.load(Meteor.settings);

// Start background processing
Processing.start();


Meteor.startup(function() {
  UserAccount.startup();
})

// Reload fixtures
if (Settings.fixtures) {
  Meteor.startup(function() {
    if (Settings.fixtures.clear)
      Fixtures.clear();
    if (Settings.fixtures.load)
      Fixtures.load();
  });
}
