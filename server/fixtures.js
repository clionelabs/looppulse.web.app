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
    var workspace = Workspaces.create(Fixtures.prefix + workspaceFixture.name, workspaceFixture.pois.name);
    console.log("[Fixtures] Importing wsId: ", workspace._id);

    _.each(workspaceFixture.applications, function(appFixture) {
      var app = Applications.create(workspace._id, appFixture.name, appFixture.token);
    });

    _.each(workspaceFixture.pois.list, function(poiFixture) {
      var poi = Pois.create(workspace._id, poiFixture.name, poiFixture.beacon);
    });

    _.each(workspaceFixture.geofences, function(geofenceFixture) {
      var geoFence = Geofences.create(workspace._id, geofenceFixture.lat, geofenceFixture.lng, geofenceFixture.radius);
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
