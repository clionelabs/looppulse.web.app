/**
 * This is the server extension on the Sessions class {@link lib/collections/sessions.js}
 */

/**
 * Create new Session
 *
 * @param {String} wsId {@link Workspace}
 * @param {String} visitorUUID
 * @param {String} sdk SDK version
 * @param {String} device Mobile device info
 *
 * @return {Session} session {@link Session}
 */
Sessions.create = function(wsId, visitorUUID, sdk, device) {
  var session = new Session({
    wsId: wsId,
    visitorId: visitorUUID,
    sdk: sdk,
    device: device
  });
  session.save();
  return session;
};
