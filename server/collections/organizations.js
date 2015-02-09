Organizations.addUserById = function (organizationId, userId) {
  return Organizations.update({_id: organizationId}, {$addToSet: {userIds: userId}});
};

/*
 * imports one organization from JSON
 */
Organizations.import = function (json) {
  if (Organizations.findOne({name: json.name})) {
    console.warn("[Organizations] Importing same organization again. Skipping.", json);
    return;
  }

  var organizationId = Organizations.insert({name: json.name});
  _.each(json.workspaces, function(workspace) {
    var workspaceId = Workspaces.insert({ organizationId: organizationId,
                                          name: workspace.name,
                                          poiDescriptors: workspace.poiDescriptors});
    _.each(workspace.applications, function(application) {
      Applications.insert({ workspaceId: workspaceId,
                            name: application.name,
                            _id: application.id,
                            token: application.token});
    });
    _.each(workspace.pois, function(poi) {
      Pois.insert({ workspaceId: workspaceId,
                    name: poi.name,
                    beacon: poi.beacon});
    });
    _.each(workspace.geofences, function(geofence) {
      Geofences.insert({ workspaceId: workspaceId,
                         lat: geofence.lat,
                         lng: geofence.lng,
                         radius: geofence.radius});
    });
  });

  _.each(json.users, function(user) {
    var userId = Accounts.createUser(user);
    Organizations.addUserById(organizationId, userId);
  });
};

_.extend(Organization.prototype, {
  'isAccessibleByUserId': function (userId) {
    var self = this;
    return _.indexOf(self.userIds, userId) != -1;
  }
});

Meteor.startup(function() {
  Meteor.users.find().observe({
    "removed": function (oldUser) {
      var oldUserId = oldUser._id;
      Organizations.update({userIds: {$in: [oldUserId]}},
                           {$pull: {userIds: oldUserId}});
    }
  })
});
