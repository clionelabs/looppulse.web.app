Template.scheduleFiller.helpers({
    getStartDate : function() {
        var sessionKey = Template.engageCreate.FormSessionKey;
        var sDate = Session.get(sessionKey).startDate;
        //Handle isBefore case in case of people working in midnight
        if (moment().isSame(sDate, "day") || moment().isAfter(sDate, "day")) {
            return "Start immediately";
        } else {
            return sDate;
        }
    },
    getEndDate : function() {
        var sessionKey = Template.engageCreate.FormSessionKey;
        var eDate = Session.get(sessionKey).endDate;
        return eDate ? eDate : "End date";
    }
});

Template.scheduleFiller.rendered = function() {
    var s = new FormSession(Template.engageCreate.FormSessionKey);
    $(".schedule-range-selector").daterangepicker({
        format: "YYYY-MM-DD",
        opens: 'center',
        timeZone: "+08:00",
        minDate: moment(),
        startDate: s.startDate,
        endDate: s.endDate
    },
    function(start, end) {
        //Handle isBefore case in case of people working in midnight
        if (moment().isSame(start, "day") || moment().isAfter(start, "day")) {
            s.set({ startDate : moment().format("YYYY-MM-DD") });
        } else {
            s.set({ startDate : start.format("YYYY-MM-DD") });
        }
        s.set({ endDate : end.format("YYYY-MM-DD") });
        $(".schedule-range-selector").data("daterangepicker").setStartDate(start);
        $(".schedule-range-selector").data("daterangepicker").setEndDate(end);
    });
};
