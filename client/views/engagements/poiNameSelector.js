
Template.poiNameSelector.helpers({
    get : function() {
        return PoisMetric.get().pois.map(function(item) {
            return { id : item._id, value : item.name, numInterested : item.interestedVisitors }
        });
    },
    selected: function(e, suggestion, dataset) {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        Session.setForm(sessionKey, "selectedPoi", suggestion);
        $("#poiSelectionModal").modal('hide');
    }
});

Template.poiNameSelector.rendered = function() {

    Meteor.typeahead.inject();

    $("#poiSelectionModal").on('shown.bs.modal', function() {
        $("#pois-selection-input").focus();
    });
};

