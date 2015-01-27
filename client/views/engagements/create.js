Template.engageCreate.FORM_SESSION_KEY = "engageCreateForm";

Template.engageCreate.events({
    "click .create" : function() {
        var uploader = new Slingshot.Upload("engageCreateGraphic");
        _.each(Dropzone.instances[0].files, function(f) {
                uploader.send(f, function (error, downloadUrl) {
                console.log(downloadUrl);
            });
        });
    }
});

Template.engageCreate.helpers({
   getSelectedPoi : function() {
       var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
       return Session.get(sessionKey).selectedPoi;
   },
    getSelectedVisitorGroupHelpText : function () {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        if (Session.get(sessionKey).selectedPoi) {
            var str = "Currently targeting ";
            var vg_interested = Template.visitorGroupSelector.visitorGroup.INTERESTED;
            if (Session.get(sessionKey).visitorGroup.match(vg_interested)) {
                str = str + "\<br>\<b>" + Session.get(sessionKey).selectedPoi.interestedVisitors + "\</b> " + "interested ";

            } else {
                str = str + "\<br>\<b>" + Session.get(sessionKey).selectedPoi.totalVisitors + "\</b> ";
            }
            str = str + "visitors.";
            return str;
        } else {
            return "None selected.";
        }
    },
    getScheduleHelpText : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        var formData = Session.get(sessionKey);

        if (Session.get(sessionKey).type
                .match(Template.budgetFiller.type.lifetime)) {

            return "";

        } else {
            var s = "\Max\.spending will be: \<b>";
            var sDate = moment(Session.get(sessionKey).startDate);
            var eDate = moment(Session.get(sessionKey).endDate);
            var amount = Session.get(sessionKey).amount;
            s = s + "HKD " + _.numberFormat(+amount * eDate.diff(sDate, "day")) + "\</b>";

            return s;

        }
    }


});

Template.engageCreate.created = function() {
    var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
    var s = {
        startDate : moment().format("YYYY-MM-DD"),
        selectedPoi : null,
        visitorGroup : Template.visitorGroupSelector.visitorGroup.INTERESTED,
        amount : 200,
        type : Template.budgetFiller.type.perDay
    };
    Session.setDefault(sessionKey, s);
};
