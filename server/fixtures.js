/**
 * This class handle Importing fixtures for boostrapping application
 * Mostly for development/ debugging purposes
 */
Fixtures = {};

Fixtures.prefix = "==FIXTURE=="; // To append application name with prefix, so we know how to remove fixture data.

/**
 * Clear all existing fixtures
 */
Fixtures.clear = function() {
  var appSelector = {"name": {$regex: "^"+Fixtures.prefix}};
  var apps = Applications.find(appSelector).fetch();
  _.each(apps, function(app) {
    console.log("[Fixtures] Removing: ", JSON.stringify(app));
    Pois.remove({appId: app.id});
    Applications.remove({_id: app.id});
  });
}

/**
 * Load fixture data from json file
 */
Fixtures.load = function() {
  var appsFixture = JSON.parse(Assets.getText("fixtures.json"));

  _.each(appsFixture, function(appFixture) {
    var application = new Application();
    application.init(Fixtures.prefix + appFixture.appName, appFixture.appToken);
    var appId = application.save();
    console.log("[Fixtures] Importing appId: ", appId);

    _.each(appFixture.pois, function(poiFixture) {
      var poi = new Poi();
      poi.init(appId, poiFixture.name, poiFixture.beacon);
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
