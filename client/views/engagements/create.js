Template.engageCreate.SessionKey = "EngageCreateForm";


Template.engageCreate.helpers({
   getSelectedPoi : function() {
       var sessionKey = Template.engageCreate.SessionKey;
       return Session.getForm(sessionKey, "selectedPoi");
   },
    getSelectedVisitorGroupHelpText : function () {
        var sessionKey = Template.engageCreate.SessionKey;
        if (Session.getForm(sessionKey).selectedPoi) {
            var str = "Currently targeting ";
            var vg_interested = Template.visitorGroupSelector.visitorGroup.INTERESTED;
            if (Session.getForm(sessionKey, "visitorGroup").match(vg_interested)) {
                str = str + "\<br>\<b>" + Session.getForm(sessionKey, "selectedPoi").interestedVisitors + "\</b> " + "interested ";

            } else {
                str = str + "\<br>\<b>" + Session.getForm(sessionKey, "selectedPoi").totalVisitors + "\</b> ";
            }
            str = str + "visitors.";
            return str;
        } else {
            return "None selected.";
        }
    }

});

Template.engageCreate.created = function() {
    var sessionKey = Template.engageCreate.SessionKey;
    var s = {};
    s[sessionKey] = {
        visitorGroup : Template.visitorGroupSelector.visitorGroup.INTERESTED,
        amount : 200,
        type : Template.budgetFiller.type.perDay
    };
    Template.initSession(s);
};
