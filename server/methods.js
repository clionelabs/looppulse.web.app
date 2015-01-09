//Remote client call for running server-side functions
Meteor.methods({
  updateUserData: function(user, orgId, data){
    console.log("Updating User profile:", user._id, data)

    //check current user
    var currentUser = Meteor.user();
    var res = "";

    //current user checking
    if (!currentUser)
      throw new Meteor.Error(403, "You need to login")

    //argument checking
    if (!userId || !orgId || !data || _.isEmpty(data))
      throw new Meteor.Error(401, "Missing Parameter")

    //Permission
    if (!UserAccount.isOrgAdmin(currentUser, orgId))
      throw new Meteor.Error(403, "You need to be an admin");

    if (!user.orgIds.some(function(o){ return o === orgId; }))
      throw new Meteor.Error(401, "User need to have a correct organization")

    res = Meteor.users.update(user._id, { $set: data  });

    return res;
  },
  updateUserProfile: function(data){
    //profile update for current user only
    var currentUserId = Meteor.userId();
    var res = "";
    console.log("Updating User profile:", currentUserId, data)

    if (!currentUserId)
      throw new Meteor.Error(403, "You need to login")

    //argument checking
    if (!data || _.isEmpty(data))
      throw new Meteor.Error(401, "Missing Parameter")

    res = Meteor.users.update(currentUserId, { $set:{ profile: data } });

    return res;
  },
  // create user with org.
  // @param:
  // data : {email, [profile]} - do not sent unencrypted password over the wire!
  // orgId: string
  // roles: array of roles
  createOrgUser: function(userData, orgId, roles){
    var currentUser = Meteor.user();
    var userId = "";
    console.log("Updating User profile:", userData)

    //check current user
    if (!currentUser)
      throw new Meteor.Error(403, "You need to login")

    //arguments checking
    if (!userData || !orgId  || !roles || _.isEmpty(userData) || !userData.email || !roles.length)
      throw new Meteor.Error(401, "Missing Parameter")

    //Permission
    if (!UserAccount.isOrgAdmin(currentUser, orgId))
      throw new Meteor.Error(403, "You need to be an admin");

    //Argument Checking

    //Check Email

    //Check the organization exist or not.

    //Add Organization to the list
    Accounts.onCreateUser(function(options, user) {
      //Add organization
      user.orgIds = [];
      user.orgIds.push(orgId);
      // Maintain the default hook's 'profile' behavior.
      if (options.profile)
        user.profile = options.profile;
      return user;
    });

    userId = Accounts.createUser(userData)

    Accounts.sendEnrollmentEmail(userId, email);

    Roles.addUsersToRoles(userId, roles, UserAccount.getOrgGroup(orgId))

    return userId;
  }
})