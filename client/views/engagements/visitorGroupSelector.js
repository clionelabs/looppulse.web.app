Template.visitorGroupSelector.visitorGroup = {
    "INTERESTED" : "interested",
    "VISITED" : "visited"
};


Template.visitorGroupSelector.helpers({
    isInterested : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        return Session.get(sessionKey).visitorGroup.match(Template.visitorGroupSelector.visitorGroup.INTERESTED);

    },
    isVisited : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        return Session.get(sessionKey).visitorGroup.match(Template.visitorGroupSelector.visitorGroup.VISITED);
    }
});

Template.visitorGroupSelector.events({
    "click #interested" : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        Session.extend(sessionKey, { visitorGroup : Template.visitorGroupSelector.visitorGroup.INTERESTED });
    },
    "click #visited" : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        Session.extend(sessionKey, { visitorGroup : Template.visitorGroupSelector.visitorGroup.VISITED });
    }
});