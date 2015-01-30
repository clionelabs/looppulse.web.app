EngagementsController = RouteController.extend({
  onBeforeAction: AccountsTemplates.ensureSignedIn
});