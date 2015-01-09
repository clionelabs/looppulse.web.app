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
    var _login = Meteor.settings.accounts.admin.login
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
      _phrase = Meteor.settings.accounts.admin.passphrase || Math.random().toString(36).slice(-8);
      _userId = Accounts.createUser({
        'email': _login,
        'password': _phrase
      });
      if (Meteor.settings.accounts.admin.showInfoAfterCreation) {
        console.info("[UserAccount] New admin created:", _login, _phrase)
      }
      if (Meteor.settings.accounts.admin.mailInfoAfterCreation) {
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
    // Extra User Account Settings
    Accounts.validateNewUser(function(user) {
      var loggedInUser = Meteor.user();

      //@@TODO: configurable function access
      if (Roles.userIsInRole(loggedInUser, ['admin'], [UserAccount.ADMIN_GROUP])) {
        return true;
      }

      throw new Meteor.Error(403, "Not authorized to create new users");
    });
  },
  startup: function() {
    var self = this;
    var _settings = null;
    console.info("[Startup] User Account Config on Server side")
    if(Meteor.settings && Meteor.settings.accounts) {
      _settings = {};
    } else {
      console.info("[UserAccount] No user accounts setting found. skip.")
      return;
    }

    //Meteor Account Setting transfer to `user-accounts`

    self.setupAdminUser(Meteor.settings.accounts.admin);

    self.config();

  }
});
