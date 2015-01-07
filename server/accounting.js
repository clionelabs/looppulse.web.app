/*
 * User Account Manager
 */
Accounting = {
  setup: function(settings) {
    if (!settings || !settings.login) { return false; }
    // Admin Account Config
    var _userId = "";
    var _phrase = "";
    var _login = Meteor.settings.accounts.admin.login
    var _user = Meteor.users.findOne({ emails: { $elemMatch: { address:  _login } } })

    if (_user && Roles.userIsInRole(_user, ['admin'])) {
      console.info("[Init] Already have admin user, good to go.", _user)
      return false;
    }

    // Setup a user if it doesn't exist
    if (!_user) {
      console.info("[Init] Admin not found. Creating Account...")
      // Set initial password or random string (when passphrase is null)
      // If random string is set in config, showInfoAfterCreation or mailInfoAfterCreation must have either one to be true
      _phrase = Meteor.settings.accounts.admin.passphrase || Math.random().toString(36).slice(-8);
      _userId = Accounts.createUser({
        'email': _login,
        'password': _phrase
      });
      if (Meteor.settings.accounts.admin.showInfoAfterCreation) {
        console.info("[Init] New admin created:", _login, _phrase)
      }
      if (Meteor.settings.accounts.admin.mailInfoAfterCreation) {
        Accounts.sendEnrollmentEmail(_userId)
      }
    }

    console.info("[Init] Adding Admin Role")
    if (_user) {
      Roles.addUsersToRoles(_user, ['admin']);
    } else if (_userId) {
      Roles.addUsersToRoles(_userId, ['admin']);
    }
    _login = null
    _phrase = null

  },
  init: function() {

    Accounts.validateNewUser(function(user) {
      var loggedInUser = Meteor.user();

      //@@TODO: configurable function access
      if (Roles.userIsInRole(loggedInUser, ['admin'])) {
        return true;
      }

      throw new Meteor.Error(403, "Not authorized to create new users");
    });
  },
  start: function() {
    var self = this;
    Meteor.startup(function() {
      var _settings = null;
      console.info("User Account Config on Server side")
      if(Meteor.settings && Meteor.settings.accounts) {
        _settings = {};
      } else {
        console.info("[Init] No user accounts setting found. skip.")
        return;
      }

      // User Account Config
      _settings.forbidClientAccountCreation = Meteor.settings.accounts.forbidClientAccountCreation || false;

      // Setup
      Accounts.config(_settings)

      self.setup(Meteor.settings.accounts.admin);

      self.init();

    });

  }
};
