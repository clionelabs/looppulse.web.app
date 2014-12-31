/**
 * Created by g on 29/12/14.
 */
Router.configure({
    layoutTemplate: 'basicLayout',
    notFoundTemplate: 'notFound',
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

Router.route('/pois', {
    name: 'pois',
    controller: PoisController
});

Router.route('/poi/:id', {
    name: 'poi',
    controller: PoiController
});

Router.route('/poi/create', {
    name: 'poi.create',
    controller: PoiCreateController
});

Router.route('/engagements', {
    name: 'engagements',
    controller: EngagementsController
});

Router.route('/engagement/:id', {
    name: 'engagement',
    controller: EngagementController
});

Router.route('/engagement/create', {
    name: 'engagement.create',
    controller: EngagementCreateController
});

Router.route('loading', {
        path: '/loading'
});