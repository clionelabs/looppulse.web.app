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
  var visitorId = Visitors.findOneOrInsert({wsId: workspace._id, uuid: sessionInfo.visitorUUID});
  var sessionId = Sessions.insert({appId: application._id, visitorId: visitorId, sdk: sessionInfo.sdk, device: sessionInfo.device});

  var pois = Pois.find({wsId: workspace._id}, {fields: {_id: 1, name: 1, beacon: 1}}).fetch();
  var geofences = Geofences.find({wsId: workspace._id}, {fields: {_id: 1, lat: 1, lng: 1, radius: 1}}).fetch();

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
