Meteor.startup(function(){
  Meteor.users.find().observe({
    _suppress_initial: true,
    "added": function(newUser) {
      if (!newUser.password) {
        Accounts.sendEnrollmentEmail(newUser._id);
      }
    }
  })
});
