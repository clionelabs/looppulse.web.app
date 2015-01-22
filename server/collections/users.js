Meteor.startup(function(){
    _.extend(Meteor.users, {
    addOrganizationById: function (userId, organizationId) {
      Meteor.users.update({_id: userId}, {$addToSet: {organizationIds: organizationId}});
    }
  });
  Meteor.users.find().observe({
    "added": function(newUser) {
      if (!newUser.password) {
        Accounts.sendEnrollmentEmail(newUser._id);
      }
    }
  })
});
