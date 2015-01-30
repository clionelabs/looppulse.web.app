PoiCreateController = RouteController.extend({
  onBeforeAction: AccountsTemplates.ensureSignedIn
});
