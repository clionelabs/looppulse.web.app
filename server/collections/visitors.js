/**
 * This is the server extension on the Visitors class {@link lib/collections/visitors.js}
 */

/*
 * Create a visitor, if not already existed.
 * A visitor is unique across a pair of workspace and device UUID
 *
 * @param {String} wsid {@link Workspace}
 * @param {String} uuid Device UUID
 *
 * @return {Visitor} visitor
 */
Visitors.findOneOrCreate = function(wsId, uuid) {
  var visitorDoc = {wsId: wsId, uuid: uuid};

  var visitor = Visitors.findOne(visitorDoc);
  if (visitor) return visitor;

  visitor = new Visitor(visitorDoc);
  visitor.save();
  return visitor;
}
