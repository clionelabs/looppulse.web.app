var selectedPoiSessionKey = Template.engageCreate.selectedPoiSessionKey;

Template.poiNameSelector.helpers({
    get : function() {
        return PoisMetric.get().pois.map(function(item) {
            console.log(item);
            return { id : item._id, value : item.name, numInterested : item.interestedVisitors }
        });
    },
    selected: function(e, suggestion, dataset) {
        Session.setTemp(selectedPoiSessionKey, suggestion);
        $("#poiSelectionModal").modal('hide');
    }
});

Template.poiNameSelector.rendered = function() {
    Meteor.typeahead.inject();
};

