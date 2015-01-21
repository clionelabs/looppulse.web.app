Template.visitorGroupSelector.selectedVisitorGroupKey = "-engageCreate-selectedVisitorGroup";

var selectedVisitorGroupKey = Template.visitorGroupSelector.selectedVisitorGroupKey;

var VG_INTERESTED = "interested";
var VG_VISITED = "visited";

Template.visitorGroupSelector.helpers({
    isInterested : function() {
        return Session.get(selectedVisitorGroupKey).indexOf(VG_INTERESTED) === 0;

    },
    isVisited : function() {
        return Session.get(selectedVisitorGroupKey).indexOf(VG_VISITED) === 0;
    }
});
