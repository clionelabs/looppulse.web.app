/**
 * Workspace
 *
 * Document property
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
