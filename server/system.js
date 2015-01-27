System = {
  'validateSettings': function () {

    // TODO: we need to check every single key to ensure correctness

    // Required fields:
    if (Meteor.settings.firebase.root === null) {
      console.error('[System] Missing firebase settings');
    }
  },

  'configureEmail': function () {
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
