if (Meteor.settings.DEBUG.logging) {
  Debug = {
    observeBeaconEvents: function () {
      BeaconEvents.find().observe({
        _suppress_initial: true,
        "added": function(event) {
          console.log("[DEBUG] [BeaconEvent] created ", event);
        }
      });
    }
  };

  Meteor.startup(function() {
    Debug.observeBeaconEvents();
  });
}
