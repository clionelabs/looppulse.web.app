// Override default settings
Settings.load(Meteor.settings);

// Normal Server Flow

// Start background processing
Processing.start();

// Reload fixtures
if (Settings.fixtures) {
  Meteor.startup(function() {
    if (Settings.fixtures.clear)
      Fixtures.clear();
    if (Settings.fixtures.load)
      Fixtures.load();
  });
}
