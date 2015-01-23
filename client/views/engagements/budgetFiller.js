
Template.budgetFiller.type = {
    perDay : "per-day",
    lifetime : "lifetime"
};

Template.budgetFiller.helpers({

    printBudget : function() {
        var sessionKey = Template.engageCreate.FormSessionKey;
        return "HKD " + Session.get(sessionKey).amount +
            (Template.budgetFiller.type.perDay.match(Session.get(sessionKey).type)
                ? " per day" : " lifetime");
    },
    isPerDay : function() {
        var sessionKey = Template.engageCreate.FormSessionKey;
        return Template.budgetFiller.type.perDay.match(Session.get(sessionKey).type);
    },
    isLifetime : function() {
        var sessionKey = Template.engageCreate.FormSessionKey;
        return Template.budgetFiller.type.lifetime.match(Session.get(sessionKey).type);
    },
    getBudgetAmount : function() {
        var sessionKey = Template.engageCreate.FormSessionKey;
        return Session.get(sessionKey).amount;
    }

});

Template.budgetFiller.events({
    "click .toggle-edit" : function(e) {
        $.toggleView(".budget-edit", ".budget-display");
    },
    "click .glyphicon-ok, blur .amount" : function(e) {
        var sessionKey = Template.engageCreate.FormSessionKey;
        $.toggleView(".budget-display", ".budget-edit");
        Session.extend(sessionKey, { "amount" : $(".amount")[0].value });
    },
    "click .select-budget-type-per-day" : function(e) {
       var sessionKey = Template.engageCreate.FormSessionKey;
       Session.extend(sessionKey, { "type" : Template.budgetFiller.type.perDay });
    },
    "click .select-budget-type-lifetime" : function(e) {
        var sessionKey = Template.engageCreate.FormSessionKey;
        Session.extend(sessionKey, { "type" : Template.budgetFiller.type.lifetime });
    }
});

Template.budgetFiller.rendered = function() {
    $(".budget-edit").hide();
    var sessionKey = Template.engageCreate.FormSessionKey;
    $(".amount")[0].value = Session.get(sessionKey).amount;

};

