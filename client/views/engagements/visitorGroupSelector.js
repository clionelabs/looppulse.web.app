var SessionKey = Template.engageCreate.SessionKey;
Template.visitorGroupSelector.visitorGroup = {
    "INTERESTED" : "interested",
    "VISITED" : "visited"
};


Template.visitorGroupSelector.helpers({
    isInterested : function() {
        return Session.get(SessionKey).visitorGroup.match(Template.visitorGroupSelector.visitorGroup.INTERESTED);

    },
    isVisited : function() {
        return Session.get(SessionKey).visitorGroup.match(Template.visitorGroupSelector.visitorGroup.VISITED);
    }
});

Template.visitorGroupSelector.events({
    "click #interested" : function() {
        Session.setForm(SessionKey, "visitorGroup", Template.visitorGroupSelector.visitorGroup.INTERESTED);
    },
    "click #visited" : function() {
        Session.setForm(SessionKey, "visitorGroup", Template.visitorGroupSelector.visitorGroup.VISITED);
    }
});
