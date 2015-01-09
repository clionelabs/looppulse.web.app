/**
 * Server extension for applications.js
 */
Applications.authenticate = function(appId, appToken, sessionInfo) {
  var application = Applications.findOne({_id: appId, token: appToken});
  if (!application) {
    return {authenticated: false, statusCode: 401};
  }

  // Get the corresponding workspace for this application
  var workspace = application.getWorkspace();

  // Generate firebase access token
  var tokenGenerator = new FirebaseTokenGenerator(Settings.firebase.secret);
  var firebaseToken = tokenGenerator.createToken({wsId: workspace._id});

  // Build firebase paths
  var firebaseRoot = workspace.getFirebaseRoot();
  var firebasePaths = workspace.getFirebaseEventPaths();

  // Create session data
  var sessionId = Sessions.insert({appId: application._id, visitorUUID: sessionInfo.visitorUUID, sdk: sessionInfo.sdk, device: sessionInfo.device});

  // Other workspace data
  var pois = _.map(workspace.getPois(), function(poi) {
    return {_id: poi._id, name: poi.name, beacon: poi.beacon}; // It's not necessary that all fields are public.
  });
  var geofences = _.map(workspace.getGeofences(), function(geofence) {
    return {_id: geofence._id, lat: geofence.lat, lng: geofence.lng, radius: geofence.radius}; // It's not necessary that all fields are public.
  });

  var response = {
    authenticated: true,
    statusCode: 200,
    session: sessionId,
    system: {
      firebase: {
        root: firebaseRoot,
        token: firebaseToken,
        paths: firebasePaths
      },
      pois: pois,
      geofences: geofences
    }
  };
  return response;
};

Meteor.startup(function() {
  Workspaces.find().observe({
    "removed": function(workspace) {
      Applications.remove({wsId: workspace._id});
    }
  });
});
