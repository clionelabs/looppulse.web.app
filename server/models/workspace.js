/**
 * This is the server extension on the Workspace class {@link lib/models/workspace.js}
 */

/**
 * Authenticate workspace; Check appId and appToken.
 *
 * @param {String} appId
 * @param {String} appTokeni
 * @param {Object} sessionInfo {visitorUUID: xxx, sdk: xxx, device: xxx}
 *
 * @return {Object} response in JSON
 */
Workspace.authenticate = function(appId, appToken, sessionInfo) {
  var workspace = Workspaces.findOne({"applications.appId": appId, "applications.appToken": appToken});
  if (!workspace) {
    return {authenticated: false, statusCode: 401};
  }

  var response = {};
  response["authenticated"] = true;
  response["statusCode"] = 200;
  response["beacons"] = []; // TODO

  // Create session data
  var session = Sessions.create(
    workspace._id,
    sessionInfo.visitorUUID,
    sessionInfo.sdk,
    sessionInfo.device);
  response["session"] = session._id;

  return response;
};
