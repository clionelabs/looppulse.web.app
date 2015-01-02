/**
 * Application
 */
Applications = new Meteor.Collection('applications', {
  transform: function(doc) {
    return new Application(doc);
  }
});

if (Meteor.isServer) {
  Applications.create = function(wsId, name, token) {
    var app = new Application({wsId: wsId, name: name, token: token});
    app.save();
    return app;
  };

  Applications.authenticate = function(appId, appToken, sessionInfo) {
    var application = Applications.findOne({_id: appId, token: appToken});
    if (!application) {
      return {authenticated: false, statusCode: 401};
    }

    // Get the corresponding workspace for this application
    var workspace = application.getWorkspace();

    // Create session data
    var visitor = Visitors.findOneOrCreate(workspace._id, sessionInfo.visitorUUID);
    var session = Sessions.create(application._id, visitor._id, sessionInfo.sdk, sessionInfo.device);
    var beacons = _.map(Pois.find({wsId: workspace._id}).fetch(), function(item) {
      return {name: item.name, beacon: item.beacon};
    });

    var response = {
      authenticate: true,
      statusCode: 200,
      beaconEventURL: Settings.firebase.beaconEvents,
      beacons: beacons,
      session: session._id
    };
    return response;
  };

  Applications.find().observe({
    "removed": function(application) {
      console.log("[Appllications] Removing application: ", application);
      Sessions.remove({appId: application._id});
    }
  });
}

/**
 *
 * Class constructor
 * @property {String} wsId {@link Workspace}
 * @property {String} name
 * @property {String} token Access token
 */
Application = function(doc) {
  _.extend(this, doc);
};

Application.prototype.getWorkspace = function() {
  return Workspaces.findOne({_id: this.wsId});
};

if (Meteor.isServer) {
  Application.prototype.save = function() {
    var self = this;
    var selector = {_id: self._id};
    var modifier = {
      $set: {
        wsId: self.wsId,
        name: self.name,
        token: self.token
      }
    }
    var result = Applications.upsert(selector, modifier);
    if (result.insertedId) {
      self._id = result.insertedId;
    }
    return self._id;
  };
}
