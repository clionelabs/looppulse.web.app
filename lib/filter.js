Router._filters = {
  isLoggedIn: AccountsTemplates.ensureSignedIn,
  isMember : function (){
    var organizationId = this.params.id || Session.get("userCurrentOrg")
    if (!organizationId ){
      this.render("error", { data: Meteor.Error(401, "Missing Organizations") })
    } else if (Organizations.find({ _id: organizationId }).count() <= 0) {
      this.render("error", { data: Meteor.Error(401, "No Organizations found or You don't have access. Please contact administrator.") })
    } else {
      this.next();
    }
  },
  isReady: function() {
    if (!this.ready()) {
      this.render('loading');
    }else{
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
    //Exception will be home page and some useraccounts related page (see Route Name at https://github.com/meteor-useraccounts/core#routing), temporary disabled
    //Router.onBeforeAction(filters.isLoggedIn, {except: ['home', 'atSignIn', 'atResetPwd','atEnrollAccount', 'atForgotPwd', 'atVerifyEmail']});
    //@@TODO: change only to except
    Router.onBeforeAction(filters.isMember, {only: ['organization.home']});

    // After Hooks

    // Router.onAfterAction();

    // Unload Hooks

    //

  }

});