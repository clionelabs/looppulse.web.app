/**
 * Server extension for pois.js
 */
Meteor.startup(function() {
  Workspaces.find().observe({
    "removed": function(workspace) {
      Pois.remove({workspaceId: workspace._id});
    }
  });
  Pois._ensureIndex({workspaceId: 1});
});

/*
 * workspaceId
 * pois: array of json doc containing name and beacon details
 *
 * example of pois:
 [
   {"name": "poi1",
     "beacon": {
       "uuid": "a2dca1e4-0607-4f37-9ff1-825237b278fe",
       "major": 214,
       "minor": 2104
     }
   },
   {"name": "poi2",
     "beacon": {
       "uuid": "a2dca1e4-0607-4f37-9ff1-825237b278fe",
       "major": 1901,
       "minor": 102
     }
   }
  ]
 *
 */
Pois.bulkCreate = function (workspaceId, pois) {
  var created = 0;

  // We are more cautious here because we reading external file.
  if (!Workspaces.findOne({_id: workspaceId})) {
    throw new Meteor.Error('invalid-workspace-id', 'Workspace ID is invalid.');
  }

  _.each(pois, function(poi) {
    Pois.validate(poi);
    Pois.insert(poi);
    created++;
  });

  return created;
};

Pois.validate = function (creationOptions) {
  check(creationOptions, {
    name: String,
    beacon: {
      uuid: String,
      major: Number,
      minor: Number
    }
  });
}
