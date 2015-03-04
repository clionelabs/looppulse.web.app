Engagements = new Meteor.Collection("engagements");

Engagement = {};
Engagement.visitorGroup = {
    "INTERESTED" : "interested",
    "VISITED" : "visited"
};

Engagement.budgetType = {
  PER_DAY : "per-day",
  LIFETIME : "lifetime"
};
Engagement.validate = function(doc) {
  var vs = [
      !!(doc.name),
      !!(doc.amount),
      !!(_.isEqual(doc.budgetType, Engagement.budgetType.PER_DAY)
            || _.isEqual(doc.budgetType, Engagement.budgetType.LIFETIME)),
      !!(doc.startDate),
      !!(doc.endDate),
      (_.isEqual(doc.visitorGroup, Engagement.visitorGroup.VISITED)
          || _.isEqual(doc.visitorGroup, Engagement.visitorGroup.INTERESTED)),
      !!(doc.targetUrl),
      !!(doc.text)
  ];
  console.log(vs);
  return _.reduce(vs, function(memo, v) {
    return v && memo;
  })
};

Engagement.getDefault = function() {
  return {
    name: "",
    startDate: moment().format("YYYY-MM-DD"),
    visitorGroup: Engagement.visitorGroup.INTERESTED,
    amount: 200,
    budgetType: Engagement.budgetType.PER_DAY,
    targetUrl: "",
    text : "",
    feedPlacement : {
      desktop : false,
      mobile : false,
      rightColumn : false
    }
  };

};
