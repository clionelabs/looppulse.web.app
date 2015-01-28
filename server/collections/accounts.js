_.extend(Accounts, {
  'configureEmailTemplates': function () {
    var self = this;
    var settings = Meteor.settings.email.templates;

    Accounts.emailTemplates.siteName = settings.siteName;
    Accounts.emailTemplates.from = settings.from;
    self.configureEnrollAccountTemplates();
    self.configureVerifyEmailTemplates();
    self.configureResetPasswordTemplates();

    console.info('[Accounts] Email templates configured');
  },

  'emailSignature': 'Team Loop Pulse\nhttp://twitter.com/looppulse',

  'configureEnrollAccountTemplates': function () {
    var organizationName = function (user) {
      var orgName = 'our Beta program';
      var pending = Invitations.pending(user.emails[0].address);
      if (pending.length > 0) {
        // TODO: should grab the latest invitation
        var invitedOrganization = Organizations.findOne({_id: pending[0].organizationId});
        orgName = invitedOrganization.name;
      }
      return orgName;
    }

    Accounts.emailTemplates.enrollAccount.subject = function (user) {
      return '[Loop Pulse] Invitation to ' + organizationName(user);
    };
    Accounts.emailTemplates.enrollAccount.text = function (user, url) {
      return 'You have been invited to ' + organizationName(user) + ' on Loop Pulse.\n'+
             'Please activate your account using the link below:\n\n'+
             url + '\n\n' +
             Accounts.emailSignature;
    };
  },

  'configureVerifyEmailTemplates': function () {
    Accounts.emailTemplates.verifyEmail.subject = function (user) {
      return '[Loop Pulse] Email Verification';
    };
    Accounts.emailTemplates.resetPassword.text = function (user, url) {
      return 'Thank you for signing up.\n'+
             'Please verify your email by clicking on the link below:\n\n'+
             url + '\n\n' +
             Accounts.emailSignature;
    };
  },

  'configureResetPasswordTemplates': function () {
    Accounts.emailTemplates.resetPassword.subject = function (user) {
      return '[Loop Pulse] Reseting Password';
    };
    Accounts.emailTemplates.resetPassword.text = function (user, url) {
      return 'You have recently requested to reset your password.\n'+
             'Please follow the link below for instructions:\n\n'+
             url + '\n\n' +
             'If you did not initiate this request, please contact us.\n\n'
             Accounts.emailSignature;
    };
  }
});
