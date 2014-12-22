/**
 * This is the server extension on the Visitors class {@link lib/collections/visitors.js}
 */

/*
 * Create a visitor, if not already existed.
 * A visitor is unique across a pair of application and device UUID
 *
 * @param {String} appid {@link Application}
 * @param {String} uuid Device UUID
 *
 * @return {Visitor} visitor
 */
Visitors.findOneOrCreate = function(appId, uuid) {
  var visitor = Visitors.findOne({appId: appId, uuid: uuid});
  if (visitor) return visitor;

  visitor = new Visitor();
  visitor.init(appId, uuid, '');
  visitor.save();
  return Visitors.findOne({_id: visitor._id});
}
