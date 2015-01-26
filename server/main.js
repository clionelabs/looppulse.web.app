Settings.check(Meteor.settings);

// Normal Server Flow

// Start background processing
Processing.start();

// Reload fixtures
if (Meteor.settings.fixtures) {
  Meteor.startup(function() {
    if (Meteor.settings.fixtures.clear)
      Fixtures.clear();
    if (Meteor.settings.fixtures.load)
      Fixtures.load();
  });
}
