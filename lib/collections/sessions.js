/**
 * An Meteor collection for Session objects {@link lib/models/session.js}
 */
Sessions = new Meteor.Collection('sessions', {
  transform: function(doc) {
    var session = new Session();
    session.initFromDoc(doc);
    return session;
  }
});
