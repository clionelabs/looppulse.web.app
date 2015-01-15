/*
 * User Account Manager, server side
 */
_.extend(UserAccount, {
  "ADMIN_GROUP": "__ADMIN__",
  // Create admin user or give admin permission to specific account.
  setupAdminUser: function(settings) {
    if (!settings || !settings.login) { return false; }
    // Admin Account Config
    var _userId = "";
    var _phrase = "";
    var _login = Settings.accounts.admin.login
    var _user = Meteor.users.findOne({ emails: { $elemMatch: { address:  _login } } })
    var self = this;

    if (_user && Roles.userIsInRole(_user, ['admin'], self.ADMIN_GROUP)) {
      console.info("[UserAccount] Already have admin user, good to go.", _user)
      return true;
    } else {
      console.info("[UserAccount] Admin user not found/without proper role")
    }

    // Setup a user if it doesn't exist
    if (!_user) {
      console.info("[UserAccount] Admin not found. Creating Account...")
      // Set initial password or random string (when passphrase is null)
      // If random string is set in config, showInfoAfterCreation or mailInfoAfterCreation must have either one to be true
      _phrase = Settings.accounts.admin.passphrase || Math.random().toString(36).slice(-8);
      _userId = Accounts.createUser({
        'email': _login,
        'password': _phrase
      });
      if (Settings.accounts.admin.showInfoAfterCreation) {
        console.info("[UserAccount] New admin created:", _login, _phrase)
      }
      if (Settings.accounts.admin.mailInfoAfterCreation) {
        Accounts.sendEnrollmentEmail(_userId)
      }
    } else {
      _userId = _user._id;
      console.info("[UserAccount] Admin user found: ", _userId)
    }

    // Add admin permission
    console.info("[UserAccount] Adding Admin Role")
    Roles.addUsersToRoles(_userId, ['admin'], self.ADMIN_GROUP);

    _login = null
    _phrase = null

  },
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
      var loggedInUser = Meteor.user();
      var userOrgs = user.orgIds;
      var isAdmin = false;

      if (userOrgs.length !== 1){
        throw new Meteor.Error(401, "Multiple new user organization is not allowed");
      }

      isAdmin = self.isOrgAdmin(loggedInUser, userOrgs[0]);

      // Creator Role checking
      if (!isAdmin) {
        throw new Meteor.Error(403, "Not authorized to create new users");
      }

      return true;
    });
  },
  startup: function() {
    var self = this;

    //Check if we have any user account
    if (!Meteor.users.findOne()) {
      console.warn('[UserAccount] You need to have an account to start. See `Settings.firstRun()`')
    }

    //Meteor Account Setting transfer to `user-accounts`
    self.config();

  },
  isOrgAdmin: function(currentUser, orgId){
    var self = this;
    return (Roles.userIsInRole(currentUser, ['admin'], self.ADMIN_GROUP) || Roles.userIsInRole(currentUser, ['admin'], self.getOrgGroup(orgId)) )
  }
});
