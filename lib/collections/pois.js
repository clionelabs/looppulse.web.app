/**
 * POI stands for Point of Interests
 *
 * Document property
 * @property {String} workspaceId {@link Workspace}
 * @property {String} name
 * @property {Doc} beacon {@link BeaconEvents} {uuid: xxx, major: xxx, minor: xxx}
 */
Pois = new Meteor.Collection("pois", {
  transform: function(doc) {
    return new Poi(doc);
  }
});

Poi = function(doc) {
  _.extend(this, doc);
};

Poi.prototype.getWorkspace = function() {
  return Workspaces.findOne({_id: this.workspaceId});
};
