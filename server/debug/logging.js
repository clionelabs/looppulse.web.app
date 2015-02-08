if (Meteor.settings.DEBUG.logging) {
  Debug = {
    observeCreation: function () {
      var classes = [
        {class: Organizations, name: 'Organizations'},
        {class: Workspaces, name: 'Workspaces'},
        {class: Pois, name: 'POIs'},
        {class: BeaconEvents, name: 'BeaconEvents'}
      ];
      _.each(classes, function(h) {
        h.class.find().observe({
          _suppress_initial: true,
          'added': function(newObj) {
            console.log('[DEBUG] ['+h.name+'] created', newObj);
          }
        })
      });
    }
  };

  Meteor.startup(function() {
    Debug.observeCreation();
  });
}
