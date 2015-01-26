Settings.check(Meteor.settings);

// Normal Server Flow

// Start background processing
Processing.start();

// Reload fixtures
if (Meteor.settings.DEBUG && Meteor.settings.DEBUG.fixtures) {
  Meteor.startup(function() {
    if (Meteor.settings.DEBUG.fixtures.clear)
      Fixtures.clear();
    if (Meteor.settings.DEBUG.fixtures.load)
      Fixtures.load();
  });
}
