// Override default settings
Settings.load(Meteor.settings);

// Run any initialization that need to run before the Normal Flow
if (Settings.firstRun) { // Currently we are using a flag to triggers...any better choice?
  Installation.run();
}

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
