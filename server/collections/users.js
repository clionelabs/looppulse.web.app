Meteor.startup(function(){
  Meteor.users.find().observe({
    "added": function(newUser) {
      if (!newUser.password) {
        Accounts.sendEnrollmentEmail(newUser._id);
      }
    }
  })
});
