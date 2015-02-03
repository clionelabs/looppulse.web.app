/**
 * Application
 *
 * Document property
 * @property {String} workspaceId {@link Workspace}
 * @property {String} name
 * @property {String} token Access token
 */
Applications = new Meteor.Collection('applications', {
  transform: function(doc) {
    return new Application(doc);
  }
});

Application = function(doc) {
  _.extend(this, doc);
};

Application.prototype.getWorkspace = function() {
  return Workspaces.findOne({_id: this.workspaceId});
};
