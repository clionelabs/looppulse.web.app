PoiController = RouteController.extend({
  onBeforeAction: AccountsTemplates.ensureSignedIn
});
