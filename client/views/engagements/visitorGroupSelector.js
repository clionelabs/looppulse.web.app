
Template.visitorGroupSelector.helpers({
    isInterested : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        return Session.get(sessionKey).visitorGroup === Engagement.visitorGroup.INTERESTED;

    },
    isVisited : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        return Session.get(sessionKey).visitorGroup === Engagement.visitorGroup.VISITED;
    }
});

Template.visitorGroupSelector.events({
    "click #interested" : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        Session.extend(sessionKey, { visitorGroup : Engagement.visitorGroup.INTERESTED });
    },
    "click #visited" : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        Session.extend(sessionKey, { visitorGroup : Engagement.visitorGroup.VISITED });
    }
});
