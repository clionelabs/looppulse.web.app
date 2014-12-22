/**
 * This is the server extension on the Application class {@link lib/models/application.js}
 */

/**
 * Authenticate application; Check appId and apiToken.
 *
 * @param {String} appId {@link Application}
 * @param {String} apiToken
 * @param {Object} sessionInfo {visitorUUID: xxx, sdk: xxx, device: xxx}
 *
 * @return {Object} response in JSON
 */
Application.authenticate = function(appId, apiToken, sessionInfo) {
  var app = Applications.findOne({_id: appId, apiToken: apiToken});
  if (!app) {
    return {authenticated: false, statusCode: 401};
  }

  var response = {};
  response["authenticated"] = true;
  response["statusCode"] = 200;
  response["beacons"] = []; // TODO

  // Create session data
  var session = Sessions.create(
    app._id,
    sessionInfo.visitorUUID,
    sessionInfo.sdk,
    sessionInfo.device);
  response["session"] = session._id;

  return response;
};
