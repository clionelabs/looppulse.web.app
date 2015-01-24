Template.scheduleFiller.helpers({
    getStartDate : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        var sDate = Session.get(sessionKey).startDate;
        //Handle isBefore case in case of people working in midnight
        if (moment().isSame(sDate, "day") || moment().isAfter(sDate, "day")) {
            return "Start immediately";
        } else {
            return sDate;
        }
    },
    getEndDate : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        var eDate = Session.get(sessionKey).endDate;
        return eDate ? eDate : "End date";
    }
});

Template.scheduleFiller.rendered = function() {
    var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
    $(".schedule-range-selector").daterangepicker({
        format: "YYYY-MM-DD",
        opens: 'center',
        timeZone: "+08:00",
        minDate: moment(),
        startDate: Session.get(sessionKey).startDate,
        endDate: Session.get(sessionKey).endDate
    },
    function(start, end) {
        //Handle isBefore case in case of people working in midnight
        if (moment().isSame(start, "day") || moment().isAfter(start, "day")) {
            Session.extend(sessionKey, { startDate : moment().format("YYYY-MM-DD") });
        } else {
            Session.extend(sessionKey, { startDate : start.format("YYYY-MM-DD") });
        }
        Session.extend(sessionKey, { endDate : end.format("YYYY-MM-DD") });
        $(".schedule-range-selector").data("daterangepicker").setStartDate(start);
        $(".schedule-range-selector").data("daterangepicker").setEndDate(end);
    });
};

