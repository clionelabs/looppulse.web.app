Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'not-found',
    loadingTemplate: 'loading',
    yieldTemplates: {
        'header': { to: 'header' },
        'footer': { to: 'footer' }
    },
    waitOn: function(){ //The data should have once user loggedIn
        if (Meteor.user())
            return [ Meteor.subscribe("accessible-organizations") ]
        else
            return []
    }
});

// Controllers are defined in `route_controllers/`
Router.route('loading', {
        path: '/loading'
});
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

// must go before /poi/:id or it will get overridden
Router.route('/poi/create', {
    name: 'poi.create',
    controller: PoiCreateController
});

Router.route('/poi/:id', {
    name: 'poi',
    controller: PoiController
});

Router.route('/engagements', {
    name: 'engagements',
    controller: EngagementsController
});

// must go before /engagement/:id or it will get overridden
Router.route('/engagement/create', {
    name: 'engagement.create',
    controller: EngagementCreateController
});

Router.route('/engagement/:id', {
    name: 'engagement',
    controller: EngagementController
});

Router.route('/organization/create', {
    name: 'organization.create'
});

Router.route('/organization/:id/invite', {
    name: 'organization.invite',
    data: function(){
        return Organizations.findOne({ _id: this.params.id });
    }
})


Router.route('/organization/:id', {
    name: 'organization.home',
    data: function(){
        return Organizations.findOne({ _id: this.params.id });
    }
});
