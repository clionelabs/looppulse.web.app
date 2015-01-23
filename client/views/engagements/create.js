Template.engageCreate.FormSessionKey = "engageCreateForm";


Template.engageCreate.helpers({
   getSelectedPoi : function() {
       var sessionKey = Template.engageCreate.FormSessionKey;
       return Session.get(sessionKey).selectedPoi;
   },
    getSelectedVisitorGroupHelpText : function () {
        var s = new FormSession(Template.engageCreate.FormSessionKey);
        if (s.selectedPoi) {
            var str = "Currently targeting ";
            var vg_interested = Template.visitorGroupSelector.visitorGroup.INTERESTED;
            if (s.visitorGroup.match(vg_interested)) {
                str = str + "\<br>\<b>" + s.selectedPoi.interestedVisitors + "\</b> " + "interested ";

            } else {
                str = str + "\<br>\<b>" + s.selectedPoi.totalVisitors + "\</b> ";
            }
            str = str + "visitors.";
            return str;
        } else {
            return "None selected.";
        }
    },
    getScheduleHelpText : function() {
        var s = new FormSession(Template.engageCreate.FormSessionKey);

        if (s.type.match(Template.budgetFiller.type.lifetime)) {

            return "";

        } else {
            var str = "\Max\.spending will be: \<b>";
            var sDate = moment(s.startDate);
            var eDate = moment(s.endDate);
            var amount = s.amount;
            str = str + "HKD " + _.numberFormat(+amount * eDate.diff(sDate, "day")) + "\</b>";

            return str;

        }
    }


});

Template.engageCreate.created = function() {
    var s = {
        startDate : moment().format("YYYY-MM-DD"),
        selectedPoi : null,
        visitorGroup : Template.visitorGroupSelector.visitorGroup.INTERESTED,
        amount : 200,
        type : Template.budgetFiller.type.perDay
    };
    FormSession(Template.engageCreate.FormSessionKey, s);
};
