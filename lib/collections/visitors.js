/**
 * An Meteor collection for Visitor objects {@link lib/models/visitor.js}
 */
Visitors = new Meteor.Collection('visitors', {
  transform: function(doc) {
    var visitor = new Visitor();
    visitor.initFromDoc(doc);
    return visitor;
  }
});

