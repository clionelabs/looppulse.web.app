
Template.budgetFiller.helpers({

    printBudget : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        return "HKD " + Session.get(sessionKey).amount +
            (Engagement.budgetType.PER_DAY === Session.get(sessionKey).budgetType
                ? " per day" : " LIFETIME");
    },
    isPerDay : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        return Engagement.budgetType.PER_DAY === Session.get(sessionKey).budgetType;
    },
    isLifetime : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        return Engagement.budgetType.LIFETIME === Session.get(sessionKey).budgetType;
    },
    getBudgetAmount : function() {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        return Session.get(sessionKey).amount;
    }

});

Template.budgetFiller.events({
    "click .toggle-edit" : function(e) {
        $.toggleView(".budget-edit", ".budget-display");
    },
    "click .glyphicon-ok, blur .amount" : function(e) {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        $.toggleView(".budget-display", ".budget-edit");
        Session.extend(sessionKey, { "amount" : $(".amount")[0].value });
    },
    "click .select-budget-type-per-day" : function(e) {
       var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
       Session.extend(sessionKey, { "type" : Engagement.budgetType.PER_DAY });
    },
    "click .select-budget-type-lifetime" : function(e) {
        var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
        Session.extend(sessionKey, { "type" : Engagement.budgetType.LIFETIME });
    }
});

Template.budgetFiller.rendered = function() {
    $(".budget-edit").hide();
    var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
    $(".amount")[0].value = Session.get(sessionKey).amount;

};

