/**
 * This class handle Importing testing fixtures
 * Mostly for development/ debugging purposes
 */
Fixtures = {};

Fixtures.prefix = "==FIXTURE=="; // To append workspace name with prefix, so we know how to remove fixture data.

/**
 * Clear all existing fixtures
 */
Fixtures.clear = function() {
  var wsSelector = {"name": {$regex: "^"+Fixtures.prefix}};
  var workspaces = Workspaces.find(wsSelector).fetch();
  _.each(workspaces, function(workspace) {
    console.log("[Fixtures] Removing: ", JSON.stringify(workspace));
    Pois.remove({wsId: workspace._id});
    Workspaces.remove({_id: workspace._id});
  });
}

/**
 * Load fixture data from json file
 */
Fixtures.load = function() {
  var fixture = JSON.parse(Assets.getText("fixtures.json"));
  var workspacesFixture = fixture.workspaces;

  _.each(workspacesFixture, function(workspaceFixture) {
    var workspace = new Workspace({
      name: Fixtures.prefix +  workspaceFixture.wsName,
      applications: workspaceFixture.applications 
    });
    var wsId = workspace.save();
    console.log("[Fixtures] Importing wsId: ", wsId);

    _.each(workspaceFixture.pois, function(poiFixture) {
      var poi = new Poi({wsId: wsId, name: poiFixture.name, beacon: poiFixture.beacon});
      poi.save();
    });
  });
}

/**
 * Wrapper to do clear and load
 */
Fixtures.reload = function() {
  Fixtures.clear();
  Fixtures.load();
}
