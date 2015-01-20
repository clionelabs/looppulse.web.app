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
  // create user with org and send an "invitation" email to them
  // @param:
  // data : {email, orgId, {profile}} - do not sent unencrypted password over the wire!
  inviteOrgUser: function(userData){
    var currentUser = Meteor.user(); //Current loggedIn user, which should be an admin
    var userId = "";
    console.log("Going to setup User:", userData)

    //check current user
    if (!currentUser)
      throw new Meteor.Error(403, "You need to login")

    //Permission
    if (!UserAccount.isOrgAdmin(currentUser, userData.orgId))
      throw new Meteor.Error(403, "You need to be an admin");

    //arguments checking
    if (!UserAccount.validateUserData(userData, "user"))
      throw new Meteor.Error(401, "Missing Parameter")

    //Argument Checking

    //Check Password

    //Check Email

    //Check the organization exist or not.

    userId = Accounts.createUser(userData)

    Roles.addUsersToRoles(userId, ["user"], UserAccount.getOrgGroup(userData.orgId))

    Accounts.sendEnrollmentEmail(userId, userData.email);

    console.log("[User] User invited successfully: ", userData.email, userId)
    return { result:"success", userId: userId, email: userData.email };
  },
  //Setup a new Org with Admin
  buildOrg: function(orgData, adminData){
    var orgId = "";
    var userData = adminData;
    var userId = "";

    // Create new org
    /// Some lazy checking here.
    if (!orgData || !orgData.name) 
      throw new Meteor.Error(401, "Missing Org Name")

    orgId = Organizations.insert({ name: orgData.name });

    // Create admin
    /// Assign admin an new org *
    userData.orgId = orgId;

    /// Arguments checking
    if (!UserAccount.validateUserData(userData, "admin"))
      throw new Meteor.Error(401, "Missing Parameter")

    userId = Accounts.createUser(userData)

    Roles.addUsersToRoles(userId, ["admin"], UserAccount.getOrgGroup(userData.orgId))

    if (userData.password)
      Accounts.sendVerificationEmail(userId, userData.email);
    else
      Accounts.sendEnrollmentEmail(userId, userData.email);

    return { result:"success", userId: userId, email: userData.email, orgId: orgId };
  }
})