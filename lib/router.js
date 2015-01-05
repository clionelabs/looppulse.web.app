/**
 * Created by g on 29/12/14.
 */
Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'not-found',
    loadingTemplate: 'loading',
    yieldTemplates: {
        'header': { to: 'header',
            //TODO temp
            data : function() {return {poiName : {one : "Restaurant", many : "Restaurants"}};}
        },
        'footer': { to: 'footer' }
    }
});

// Controllers are defined in `route_controllers/`
Router.route('/', {
    name: 'home',
    controller: HomeController
});

Router.route('/home', {
    name: 'user.home',
    template: 'welcome'
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