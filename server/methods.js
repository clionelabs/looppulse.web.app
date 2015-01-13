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
    if (!userData || _.isEmpty(userData) || !userData.orgId  || !userData.roles  || !userData.email || !userData.roles.length)
      throw new Meteor.Error(401, "Missing Parameter")

    //Permission
    if (!UserAccount.isOrgAdmin(currentUser, userData.orgId))
      throw new Meteor.Error(403, "You need to be an admin");

    //Argument Checking

    //Check Email

    //Check the organization exist or not.

    userId = Accounts.createUser(userData)

    Roles.addUsersToRoles(userId, userData.roles, UserAccount.getOrgGroup(userData.orgId))

    Accounts.sendEnrollmentEmail(userId, userData.email);

    console.log("[User] User created successfully: ", userData.email, userId)
    return { result:"success", userId: userId, email: userData.email };
  }
})