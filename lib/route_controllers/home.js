HomeController = RouteController.extend({
  template: 'home',
  onBeforeAction : function() {
    if (Meteor.user()) { Router.go("/pois") };
  }
});