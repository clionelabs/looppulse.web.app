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
  _.each(Organizations.find(fixtureSelector).fetch(), function(organization) {
    console.log("[Fixtures] Clearing Up organzation: ", organization);
    _.each(organization.userIds, function(userId) {
      Meteor.users.remove(userId);
    });
  });
  Organizations.remove(fixtureSelector);
};

/**
 * Load fixture data from json file
 */
Fixtures.load = function(orgFixture) {
  var name = Fixtures.prefix + " " + orgFixture.name;

  // Simply ignore the fixture if it has been imported before
  // We do not support updating the fixtures at the moment - but you can always clear the old one first
  if (Organizations.findOne({name: name})) {
    console.log("[Fixture] Skipping Organization: ", orgFixture.name);
    return;
  }

  console.log("[Fixture] Importing Organization: ", orgFixture.name);

  var organizationId = Organizations.insert({name: name});

  orgFixture.workspaces.forEach(function(wsFixture) {
    var workspaceId = Workspaces.insert({organizationId: organizationId, name: wsFixture.name, poiDescriptors: wsFixture.poiDescriptors});

    wsFixture.applications.forEach(function(appFixture) {
      Applications.insert({workspaceId: workspaceId, name: appFixture.name, token: appFixture.token});
    });

    wsFixture.pois.forEach(function(poiFixture) {
      Pois.insert({workspaceId: workspaceId, name: poiFixture.name, beacon: poiFixture.beacon});
    });

    wsFixture.geofences.forEach(function(geofenceFixture) {
      Geofences.insert({workspaceId: workspaceId, lat: geofenceFixture.lat, lng: geofenceFixture.lng, radius: geofenceFixture.radius});
    });
  });

  orgFixture.users.forEach(function(userFixture) {
    var userId = Accounts.createUser(userFixture);
    Organizations.addUserById(organizationId, userId);
  });
};

Fixtures.loadFromDefault = function() {
  var fixture = JSON.parse(Assets.getText("fixtures.json"));
  _.each(fixture.organizations, function(orgFixture) {
    Fixtures.load(orgFixture);
  });
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
        Fixtures.loadFromDefault();
      }
    }
  );
}
