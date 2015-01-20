/*
 * User Account Manager, server side
 */
_.extend(UserAccount, {
  config: function() {
    var self = this;
    // Extra User Account Settings
    // Creation Hook
    // Add Organization to the list
    Accounts.onCreateUser(function(options, user) {
      //Add organization
      user.orgIds = [];
      user.orgIds.push(options.orgId);
      // Maintain the default hook's 'profile' behavior.
      if (options.profile)
        user.profile = options.profile;
      return user;
    });

    // Creation Limit
    Accounts.validateNewUser(function(user) {
      var userOrgs = user.orgIds;

      // Try to make thing simple in the beginning.
      if (userOrgs.length !== 1){
        throw new Meteor.Error(401, "Multiple new user organization is not allowed");
      }

      // Creator Role/Condition checking
      // Moved to method

      return true;
    });
  },
  startup: function() {
    var self = this;

    //@@TODO: integrity checking

    //Meteor Account Setting transfer to `user-accounts`
    self.config();

  },
  // common user Data validation
  validateUserData: function(userData, role){
    //common role user data checking
    if (!userData || _.isEmpty(userData) || !userData.orgId  || !userData.email)
      throw new Meteor.Error(401, "Missing Parameter")

    // specific role user data checking
    if (role === "user") {

    }
    if (role === "admin") {

    }
    return true;
  },
  isOrgAdmin: function(currentUser, orgId){
    var self = this;
    return Roles.userIsInRole(currentUser, ['admin'], self.getOrgGroup(orgId)) 
  }
});
