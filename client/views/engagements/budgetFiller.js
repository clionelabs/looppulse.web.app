
Template.budgetFiller.type = {
    perDay : "per-day",
    lifetime : "lifetime"
};

Template.budgetFiller.helpers({

    printBudget : function() {
        var sessionKey = Template.engageCreate.SessionKey;
        return "HKD " + Session.getForm(sessionKey, "amount") +
            (Template.budgetFiller.type.perDay.match(Session.getForm(sessionKey,"type"))
                ? " per day" : " lifetime");
    },

    isPerDay : function() {
        var sessionKey = Template.engageCreate.SessionKey;
        return _.contains([Template.budgetFiller.type.perDay], Session.getForm(sessionKey,"type"));
    },
    isLifetime : function() {
        var sessionKey = Template.engageCreate.SessionKey;
        return _.contains([Template.budgetFiller.type.lifetime], Session.getForm(sessionKey,"type"));
    },
    getBudgetAmount : function() {
        var sessionKey = Template.engageCreate.SessionKey;
        return Session.getForm(sessionKey, "amount");
    }

});

Template.budgetFiller.events({
    "click .toggle-edit" : function(e) {
        $.toggleView(".budget-edit", ".budget-display");
    },
    "click .glyphicon-ok, blur .amount" : function(e) {
        var sessionKey = Template.engageCreate.SessionKey;
        $.toggleView(".budget-display", ".budget-edit");
        Session.setForm (sessionKey, "amount", $(".amount")[0].value);
    },
    "click .select-budget-type-per-day" : function(e) {
       var sessionKey = Template.engageCreate.SessionKey;
       Session.setForm(sessionKey, "type", Template.budgetFiller.type.perDay);
    },
    "click .select-budget-type-lifetime" : function(e) {
        var sessionKey = Template.engageCreate.SessionKey;
        Session.setForm(sessionKey, "type", Template.budgetFiller.type.lifetime);
    }
});

Template.budgetFiller.rendered = function() {
    $(".budget-edit").hide();
    var sessionKey = Template.engageCreate.SessionKey;
    $(".amount")[0].value = Session.getForm(sessionKey, "amount");

};

