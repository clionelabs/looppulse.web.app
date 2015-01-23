Router._filters = {
  isLoggedIn: AccountsTemplates.ensureSignedIn,
  isMember : function (){
    var organizationId = this.params.id || Session.get("userCurrentOrg")
    var org;
    // This part should be done only after user logged in,
    // but we don't have any loggedIn hook and user can log in to any pages
    // we process that session variable here if no organizationId assigned
    if (!organizationId) {
      org = Organizations.findOne();
      if (org) {
        organizationId = org._id;
        Session.set("userCurrentOrg", organizationId)
        this.next();
      } else {
        this.render("error", { data: Meteor.Error(401, "Missing Organizations. Please contact administrator.") })
      }
    } else if (Organizations.find({ _id: organizationId }).count() <= 0) {
      this.render("error", { data: Meteor.Error(401, "No Organizations found or You don't have access. Please contact administrator.") })
    } else {
      this.next();
    }
  },
  isReady: function() {
    if (!this.ready()) {
      this.render('loading');
    } else {
      this.next(); //remember to call .next() for every filters.
    }
  },
}

Meteor.startup( function (){
  var filters = Router._filters;

  if(Meteor.isClient){

    // Hooks
    Router.onBeforeAction( function () {
      //Session clean up here

      //Session.set('*SESSION_KEY*', null);
      this.next()
    });

    // Before Hooks
    Router.onBeforeAction(filters.isReady);
    // Exception will be home page and some useraccounts related page
    // (see `Route Name` at https://github.com/meteor-useraccounts/core#routing),
    // @@NOTE: temporary disabled
    //Router.onBeforeAction(filters.isLoggedIn, {except: ['home', 'atSignIn', 'atResetPwd','atEnrollAccount', 'atForgotPwd', 'atVerifyEmail']});

    // @@TODO: change only to except
    Router.onBeforeAction(filters.isMember, {only: ['organization.home', 'user.home']});

    // After Hooks

    // Router.onAfterAction();

    // Unload Hooks

    //

  }

});