/**
 * This is the server extension on the Sessions class {@link lib/collections/sessions.js}
 */

/**
 * Create new Session
 *
 * @param {String} appId {@link Application}
 * @param {String} visitorUUID
 * @param {String} sdk SDK version
 * @param {String} device Mobile device info
 *
 * @return {Session} session {@link Session}
 */
Sessions.create = function(appId, visitorUUID, sdk, device) {
  var visitor = Visitors.findOneOrCreate(appId, visitorUUID);
  var session = new Session();
  session.init(appId, visitor.id, sdk, device, (new Date()).getTime());
  session.save();
  return Sessions.findOne({_id: session._id});
}
