Template.scheduleFiller.startDateSessionKey = "-scheduleFiller-startDate";
Template.scheduleFiller.endDateSessionKey = "-scheduleFiller-endDate"

var sDateSKey = Template.scheduleFiller.startDateSessionKey;
var eDateSKey = Template.scheduleFiller.endDateSessionKey;

Template.scheduleFiller.helpers({
    getStartDate : function() {
        var sDate = Session.get(sDateSKey);
        console.log(sDate);
        //Handle isBefore case in case of people working in midnight
        if (moment().isSame(sDate, "day") || moment().isAfter(sDate, "day")) {
            return "Start immediately";
        } else {
            console.log("dddd");
            return sDate;
        }
    },
    getEndDate : function() {
        var eDate = Session.get(eDateSKey);
        return eDate ? eDate : "End date";
    }
});

Template.scheduleFiller.created = function() {
    var s  = {};
    s[sDateSKey] = moment().format("YYYY-MM-DD");
    s[eDateSKey] = null;
    Template.initSession(s);
};

Template.scheduleFiller.rendered = function() {
    $(".schedule-range-selector").daterangepicker({
        format: "YYYY-MM-DD",
        opens: 'center',
        timeZone: "+08:00",
        minDate: moment(),
        startDate: Session.get(sDateSKey),
        endDate: Session.get(eDateSKey)
    },
    function(start, end) {
        //Handle isBefore case in case of people working in midnight
        if (moment().isSame(start, "day") || moment().isAfter(start, "day")) {
            console.log("d");
            Session.set(sDateSKey, moment().format("YYYY-MM-DD"));
        } else {
            console.log("dd");
            Session.set(sDateSKey, start.format("YYYY-MM-DD"));
        }
        Session.set(eDateSKey, end.format("YYYY-MM-DD"));
        $(".schedule-range-selector").data("daterangepicker").setStartDate(start);
        $(".schedule-range-selector").data("daterangepicker").setEndDate(end);
    });
};

