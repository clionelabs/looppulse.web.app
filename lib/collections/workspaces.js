/**
 * Workspace
 */
Workspaces = new Meteor.Collection('workspaces', {
  transform: function(doc) {
    return new Workspace(doc);
  }
});

/**
 *
 * Class constructor
 * @property {String} name
 * @property {Object[]} applications Application: {appName: xxx, appId: xxx, appToken: xxx}
 */
Workspace = function(doc) {
  _.extend(this, doc);
};

Workspace.prototype.save = function() {
  var self = this;
  var selector = {_id: self._id};
  var modifier = {
    $set: {
      name: self.name,
      applications: self.applications
    }
  }
  var result = Workspaces.upsert(selector, modifier);
  if (result.insertedId) {
    self._id = result.insertedId;
  }
  return self._id;
};
