/**
 * Workspace
 *
 * Document property
 * @property {String} organizationId {@link Organization} that owned the workspace
 * @property {String} name Workspace name
 * @property {Object} poiDescriptors Descriptors for poi, i.e. {one: xxx, many: yyy}
 */
Workspaces = new Meteor.Collection('workspaces', {
  transform: function(doc) {
    return new Workspace(doc);
  }
});

Workspace = function(doc) {
  _.extend(this, doc);
};

Workspace.prototype.getOrganization = function() {
  var self = this;
  return Organizations.findOne(self.organizationId);
};

Workspace.prototype.getPois = function() {
  return Pois.find({workspaceId: this._id}).fetch();
}

Meteor.startup(function() {
  Organizations.find().observe({
    "removed": function (oldOrganization) {
      Workspaces.remove({organizationId : oldOrganization._id});
    }
  })
});
