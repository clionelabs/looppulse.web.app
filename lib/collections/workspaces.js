/**
 * An Meteor collection for Workspace objects {@link lib/models/workspace.js}
 */
Workspaces = new Meteor.Collection('workspaces', {
  transform: function(doc) {
    var ws = new Workspace();
    ws.initFromDoc(doc);
    return ws;
  }
});
