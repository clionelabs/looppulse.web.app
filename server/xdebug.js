if (Settings.DEBUG) {
  Debug = {
    observeBeaconEvents: function () {
      BeaconEvents.find().observe({
        "added": function(event) {
          console.debug("[BeaconEvent] created ", event);
        }
      });
    }
  };

  Meteor.startup(function() {
    Debug.observeBeaconEvents();
  });
}
