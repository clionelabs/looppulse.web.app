/**
 * Workspace
 */
Workspaces = new Meteor.Collection('workspaces', {
  transform: function(doc) {
    return new Workspace(doc);
  }
});

if (Meteor.isServer) {
  Workspaces.create = function(name) {
    var workspace = new Workspace({name: name});
    workspace.save();
    return workspace;
  };

  Workspaces.find().observe({
    "removed": function(workspace) {
      console.log("[Workspaces] Removing workspace: ", workspace);
      Applications.remove({wsId: workspace._id});
      Pois.remove({wsId: workspace._id});
      Visitors.remove({wsId: workspace._id});
    }
  });
}

/**
 *
 * Class constructor
 * @property {String} name
 */
Workspace = function(doc) {
  _.extend(this, doc);
};

if (Meteor.isServer) {
  Workspace.prototype.save = function() {
    var self = this;
    var selector = {_id: self._id};
    var modifier = {
      $set: {
        name: self.name,
      }
    }
    var result = Workspaces.upsert(selector, modifier);
    if (result.insertedId) {
      self._id = result.insertedId;
    }
    return self._id;
  };
}
