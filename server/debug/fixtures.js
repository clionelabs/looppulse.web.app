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
  var fixtureSelector = {"name": {$regex: "^"+Fixtures.prefix}};
  console.log("[Fixtures] Clearing Up...");
  Workspaces.remove(fixtureSelector);
};

/**
 * Load fixture data from json file
 */
Fixtures.load = function() {
  var fixture = JSON.parse(Assets.getText("fixtures.json"));
  var workspaceFixture = fixture.workspaces;
  var orgFixture = fixture.organizations;

  if (workspaceFixture) {
    console.log("[Fixture] Importing Workspaces...");
    workspaceFixture.forEach(function(workspace) {
      var name = Fixtures.prefix + " " + workspace.name;
      var res = Workspaces.upsert({name: name}, {name: name, poiDescriptors: workspace.poiDescriptors});
      var workspaceId = (res.insertedId) ? res.insertedId : Workspaces.findOne({name: name})._id;
      console.log("[Fixture] Imported Workspace: ", workspaceId , res);

      if (workspace.applications)
        workspace.applications.forEach(function(appFixture) {
          Applications.upsert({workspaceId: workspaceId},{workspaceId: workspaceId, name: appFixture.name, token: appFixture.token});
        });

      if (workspace.pois)
        workspace.pois.forEach(function(poiFixture) {
          Pois.upsert({workspaceId: workspaceId},{workspaceId: workspaceId, name: poiFixture.name, beacon: poiFixture.beacon});
        });

      if (workspace.geofences)
        workspace.geofences.forEach(function(geofenceFixture) {
          Geofences.upsert({workspaceId: workspaceId},{workspaceId: workspaceId, lat: geofenceFixture.lat, lng: geofenceFixture.lng, radius: geofenceFixture.radius});
        });
    });
  }
};

Fixtures.toLoad = function() {
  return (Meteor.settings.DEBUG &&
          Meteor.settings.DEBUG.fixtures &&
          Meteor.settings.DEBUG.fixtures.load);
};

Fixtures.toClear = function() {
  return (Meteor.settings.DEBUG &&
          Meteor.settings.DEBUG.fixtures &&
          Meteor.settings.DEBUG.fixtures.clear);
};

Fixtures.enabled = function() {
  return Fixtures.toLoad() || Fixtures.toClear();
}

if (Fixtures.enabled()) {
  Meteor.startup(
    function() {
      if (Fixtures.toClear()) {
        Fixtures.clear();
      }
      if (Fixtures.toLoad()) {
        Fixtures.load();
      }
    }
  );
}
