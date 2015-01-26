if (Meteor.settings.DEBUG) {
  Debug = {
    observeBeaconEvents: function () {
      BeaconEvents.find().observe({
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
