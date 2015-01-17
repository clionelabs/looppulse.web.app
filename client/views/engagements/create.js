Template.engageCreate.helpers({
   getSelectedPoi : function() {
       //TODO impl
       return { _id : "dfslghslje", name : "Jamie's Kitchen" , numInterested : 2300 };
   },
    setSelectedPoi : function(poi) {
        //TODO impl to session
    }

});

Template.engageCreate.destroyed = function() {

    Session.clear(Template.engageCreate.selectedPoiSessionKey);
}

Template.engageCreate.selectedPoiSessionKey = "-engageCreate-selectedPoi";
