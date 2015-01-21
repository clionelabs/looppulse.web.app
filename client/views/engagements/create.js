Template.engageCreate.selectedPoiSessionKey = "-engageCreate-selectedPoi";
Template.engageCreate.selectedVisitorGroupKey = "-engageCreate-selectedVisitorGroup";
var selectedPoiSessionKey = Template.engageCreate.selectedPoiSessionKey;
var selectedVisitorGroupKey = Template.engageCreate.selectedVisitorGroupKey;
var VG_INTERESTED = "interested";
var VG_VISITED = "visited";

Template.engageCreate.helpers({
   getSelectedPoi : function() {
       return Session.get(selectedPoiSessionKey);
   },
    getSelectedVisitorGroupHelpText : function () {
        if (Session.get(selectedPoiSessionKey)) {
            var str = "Currently targeting ";
            if (Session.get(selectedVisitorGroupKey).indexOf(VG_INTERESTED) === 0) {
                str = str + "\<br>\<b>" + Session.get(selectedPoiSessionKey).interestedVisitors + "\</b> " + "interested ";
            } else {
                str = str + "\<br>\<b>" + Session.get(selectedPoiSessionKey).totalVisitors + "\</b> ";
            }
            str = str + "visitors.";
            return str;
        } else {
            return "None selected.";
        }
    },
    isVisitorGroupSelectedInterested : function() {
        return Session.get(selectedVisitorGroupKey).indexOf(VG_INTERESTED) === 0;

    },
    isVisitorGroupSelectedVisited : function() {
        return Session.get(selectedVisitorGroupKey).indexOf(VG_VISITED) === 0;
    },
    printScheduleHelpText : function() {
        if (Session.get(Template.budgetFiller.typeSessionKey)
                .match(Template.budgetFiller.type.lifetime)) {

            return "";

        } else {
            var s = "\Max\.spending will be: \<b>";
            var sDate = moment(Session.get(Template.scheduleFiller.startDateSessionKey));
            var eDate = moment(Session.get(Template.scheduleFiller.endDateSessionKey));
            var amount = Session.get(Template.budgetFiller.amountSessionKey);
            s = s + "HKD " + _.numberFormat(+amount * eDate.diff(sDate, "day")) + "\</b>";

            return s;

        }
    }
});

Template.engageCreate.events({
    "click #interested" : function() {
        Session.set(selectedVisitorGroupKey, VG_INTERESTED);
    },
    "click #visited" : function() {
        Session.set(selectedVisitorGroupKey, VG_VISITED);
    }
});

Template.engageCreate.created = function() {
    if (!Session.get(selectedVisitorGroupKey)) {
       Session.set(selectedVisitorGroupKey, "interested");
    }
};

Template.engageCreate.destroyed = function() {
    Session.clear(selectedPoiSessionKey);
    Session.clear(selectedVisitorGroupKey);
};
