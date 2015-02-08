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

Fixtures.loadFromDefault = function() {
  var fixture = JSON.parse(Assets.getText("fixtures.json"));
  _.each(fixture.organizations, function(orgFixture) {
    orgFixture.name = Fixtures.applyPrefix(orgFixture.name);
    Organizations.import(orgFixture);
  });
};

Fixtures.applyPrefix = function (name) {
  return Fixtures.prefix + " " + name;
}

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
