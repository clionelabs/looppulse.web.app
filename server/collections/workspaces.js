/**
 * This is the server extension on the Workspace class {@link lib/collections/workspaces.js}
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

  // Create session data
  var visitor = Visitors.findOneOrCreate(workspace._id, sessionInfo.visitorUUID);
  var session = Sessions.create(workspace._id, visitor._id, sessionInfo.sdk, sessionInfo.device);

  var response = {
    authenticate: true,
    statusCode: 200,
    beacons: [], // TODO
    session: session._id
  };
  return response;
};
