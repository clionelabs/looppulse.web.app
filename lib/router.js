Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'not-found',
    loadingTemplate: 'loading',
    yieldTemplates: {
        'header': { to: 'header' },
        'footer': { to: 'footer' }
    }
});

// Controllers are defined in `route_controllers/`
Router.route('/', {
    name: 'home',
    controller: HomeController
});

Router.route('/workspace/:workspaceId/pois', {
    name: 'pois',
    controller: PoisController
});

// must go before /poi/:id or it will get overridden
Router.route('/workspace/:workspaceId/poi/create', {
    name: 'poi.create',
    controller: PoiCreateController
});

Router.route('/workspace/:workspaceId/poi/:id', {
    name: 'poi',
    controller: PoiController
});

Router.route('/workspace/:workspaceId/engagements', {
    name: 'engagements',
    controller: EngagementsController
});

// must go before /engagement/create/:poiId
Router.route('/workspace/:workspaceId/engagement/create', {
  name: 'engagement.create',
  controller: EngagementCreateController
});
// must go before /engagement/:id or it will get overridden
Router.route('/workspace/:workspaceId/engagement/create/:poiId', {
    name: 'engagement.create.with.poi',
    controller: EngagementCreateController
});

Router.route('/workspace/:workspaceId/engagement/:id', {
    name: 'engagement',
    controller: EngagementController
});

Router.route('loading', {
        path: '/loading'
});
