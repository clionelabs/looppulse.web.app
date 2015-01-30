/**
 * Workspace
 *
 * Document property
 * @property {organizationId} organizationId that owned the workspace
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

Workspace.prototype.organization = function() {
  var self = this;
  return Organizations.findOne(self.organizationId);
}
