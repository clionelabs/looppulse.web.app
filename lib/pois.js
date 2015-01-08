/**
 * POI stands for Point of Interests
 */
Pois = new Meteor.Collection("pois", {
  transform: function(doc) {
    return new Poi(doc);
  }
});

if (Meteor.isServer) {
  Pois.create = function(wsId, name, beacon) {
    var poi = new Poi({wsId: wsId, name: name, beacon: beacon});
    poi.save();
    return poi;
  };

  Meteor.startup(function() {
    Workspaces.find().observe({
      "removed": function(workspace) {
        Pois.remove({wsId: workspace._id});
      }
    });
  });
}

/**
*
* Class constructor
* @property {String} wsId {@link Workspace}
* @property {String} name
* @property {Object} beacon
*/
Poi = function(doc) {
  _.extend(this, doc);
};

BaseCollectionModel.inheritFrom(Poi, Pois, ['wsId', 'name', 'beacon']);
