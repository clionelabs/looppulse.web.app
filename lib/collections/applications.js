/**
 * An Meteor collection for Application objects {@link lib/models/application.js}
 */
Applications = new Meteor.Collection('applications', {
  transform: function(doc) {
    var app = new Application();
    app.initFromDoc(doc);
    return app;
  }
});
