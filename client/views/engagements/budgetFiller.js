Template.budgetFiller.amountSessionKey = "-budgetFiller-amount";
Template.budgetFiller.typeSessionKey = "-budgetFiller-type";
Template.budgetFiller.type = {
    perDay : "per-day",
    lifetime : "lifetime"
};

var amountSKey = Template.budgetFiller.amountSessionKey;
var typeSKey = Template.budgetFiller.typeSessionKey;

Template.budgetFiller.helpers({
    printBudget : function() {
        return "HKD " + Session.get(amountSKey) +
            (_.contains([Template.budgetFiller.type.perDay], Session.get(typeSKey))
                ? " per day" : " lifetime");
    },

    isBudgetTypePerDay : function() {
        return _.contains([Template.budgetFiller.type.perDay], Session.get(typeSKey));
    },
    isBudgetTypeLifetime : function() {
        return _.contains([Template.budgetFiller.type.lifetime], Session.get(typeSKey));
    },
    getBudgetAmount : function() {
        return Session.get(amountSKey);
    }

});

Template.budgetFiller.events({
    "click .toggle-edit" : function(e) {
        $.toggleView(".budget-edit", ".budget-display");
    },
    "click .glyphicon-ok, blur .amount" : function(e) {
        $.toggleView(".budget-display", ".budget-edit");
        Session.set(amountSKey, $(".amount")[0].value);
    },
    "click .select-budget-type-per-day" : function(e) {
       Session.set(typeSKey, Template.budgetFiller.type.perDay);
    },
    "click .select-budget-type-lifetime" : function(e) {
        Session.set(typeSKey, Template.budgetFiller.type.lifetime);
    }
});

Template.budgetFiller.created = function() {
    var s = {};
    s[amountSKey] = 200;
    s[typeSKey] = Template.budgetFiller.type.perDay;

    Template.initSession(s);
};

Template.budgetFiller.rendered = function() {
    $(".budget-edit").hide();
    $(".amount")[0].value = Session.get(amountSKey);

};

