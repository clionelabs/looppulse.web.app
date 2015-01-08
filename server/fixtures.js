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
  Workspaces.remove(wsSelector);
}

/**
 * Load fixture data from json file
 */
Fixtures.load = function() {
  var fixture = JSON.parse(Assets.getText("fixtures.json"));
  var workspacesFixture = fixture.workspaces;

  _.each(workspacesFixture, function(workspaceFixture) {
    var wsId = Workspaces.insert({name: Fixtures.prefix + workspaceFixture.name, poiDescriptors: workspaceFixture.poiDescriptors});
    console.log("[Fixtures] Importing wsId: ", wsId);

    _.each(workspaceFixture.applications, function(appFixture) {
      Applications.insert({wsId: wsId, name: appFixture.name, token: appFixture.token});
    });

    _.each(workspaceFixture.pois, function(poiFixture) {
      Pois.insert({wsId: wsId, name: poiFixture.name, beacon: poiFixture.beacon});
    });

    _.each(workspaceFixture.geofences, function(geofenceFixture) {
      Geofences.insert({wsId: wsId, lat: geofenceFixture.lat, lng: geofenceFixture.lng, radius: geofenceFixture.radius});
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
