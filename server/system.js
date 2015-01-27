System = {
  'validateSettings': function () {

    // TODO: we need to check every single key to ensure correctness

    // Required fields:
    if (Meteor.settings.firebase.root === null) {
      console.error('[System] Missing firebase settings');
    }
  },

  'shouldSendRealEmail': function () {
    var onProduction = (process.env.NODE_ENV === 'production');
    var enableInNonProduction = Meteor.settings.email.enableInNonProduction;

    return (onProduction || enableInNonProduction);
  },

  'configureEmail': function () {
    var self = this;
    if (!self.shouldSendRealEmail()) {
      console.info('[System] Not in production mode. Sending all email to console.');
      return;
    }

    var emailSettings = Meteor.settings.email;
    var username = emailSettings.username;
    var password = emailSettings.password;
    var smtpHost = emailSettings.SMTP;
    var port = emailSettings.port;
    process.env.MAIL_URL = 'smtp://' + username + ':' + password +
                           '@' + smtpHost + ':' + port;

    console.info('[System] Email configured');
  },

  'configure': function () {
    var self = this;
    self.validateSettings();
    self.configureEmail();
  }
};
