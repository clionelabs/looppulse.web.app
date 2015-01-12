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
  var wsCollections = [Applications, Pois, Geofences];
  console.log("[Fixtures] Clearing Up...")
  Workspaces.find().forEach(function(doc){
    var wsId = doc._id;
    wsCollections.forEach(function(collection){
      collection.remove({wsId:wsId});
    })
  })
  Workspaces.remove(fixtureSelector);
  Organizations.remove(fixtureSelector);
}

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
      var wsId = '';

      if (!res.insertedId)
        wsId = Workspaces.find({name: name})
      else
        wsId = res.insertedId;
      console.log("[Fixtures] Imported Workspace: ", wsId , res);

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

  if (orgFixture) {
    console.log("[Fixture] Importing Organizations...");
    orgFixture.forEach(function(org){
      var name = Fixtures.prefix + " " + org.name;
      var res = Organizations.upsert({name: name}, {name: name});
      var orgId = (res.insertedId) ? res.insertedId : Organizations.find({name:name});
      console.log("[Fixture] Imported org", orgId,  res)
    })
  }
}

/**
 * Wrapper to do clear and load
 */
Fixtures.reload = function() {
  if (Meteor.settings.resetFixturesOnStart)
    Fixtures.clear();
  Fixtures.load();
}
