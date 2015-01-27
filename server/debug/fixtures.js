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
  var wsFixture = fixture.workspaces;
  var orgFixture = fixture.organizations;

  if (wsFixture) {
    console.log("[Fixture] Importing Workspaces...");
    wsFixture.forEach(function(ws) {
      var name = Fixtures.prefix + " " + ws.name;
      var res = Workspaces.upsert({name: name}, {name: name, poiDescriptors: ws.poiDescriptors});
      var wsId = (res.insertedId) ? res.insertedId : Workspaces.findOne({name: name})._id;
      console.log("[Fixture] Imported Workspace: ", wsId , res);

      if (ws.applications)
        ws.applications.forEach(function(appFixture) {
          Applications.upsert({wsId: wsId},{wsId: wsId, name: appFixture.name, token: appFixture.token});
        });

      if (ws.pois)
        ws.pois.forEach(function(poiFixture) {
          Pois.upsert({wsId: wsId},{wsId: wsId, name: poiFixture.name, beacon: poiFixture.beacon});
        });

      if (ws.geofences)
        ws.geofences.forEach(function(geofenceFixture) {
          Geofences.upsert({wsId: wsId},{wsId: wsId, lat: geofenceFixture.lat, lng: geofenceFixture.lng, radius: geofenceFixture.radius});
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
