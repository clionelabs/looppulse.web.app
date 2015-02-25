Template.engageCreate.FORM_SESSION_KEY = "engageCreateForm";

Template.engageCreate.events({
  "click .create": function () {
    var uploader = new Slingshot.Upload("engageCreateGraphic");
    var files = Dropzone.instances[0].files; //TODO look for better way
    _.each(files, function (f) {
      uploader.send(f, function (error, downloadUrl) {
      console.log(downloadUrl);
      });
    });
  },
  "blur input, change input": function(e) {
    //TODO prefetch and attach the lookup key as data in DOM
    var keys = (function findKeys(elem, arr) {
      if (!arr) { arr = []; }
      if (elem.parentNode) {
        var key = $(elem).data("id");
        if (key) {
          return findKeys(elem.parentNode, [{"key":key, "element" : elem}].concat(arr));
        } else {
          return findKeys(elem.parentNode, arr);
        }
      } else {
        return arr;
      }
    })(e.currentTarget);

    //Code Smell but work
    var formKey = keys[0].key;
    var formObject = Session.get(formKey);
    var currentObject = formObject;
    var parentObject = null;
    for(var i = 1; i < keys.length; i++) {
      if(currentObject[keys[i].key] === undefined) {
        if(i < keys.length - 1) {
          currentObject[keys[i].key] = {};
        } else {
          var currentElement =  $(keys[i].element);
          if (currentElement.is(":checkbox")) {
            currentObject[keys[i].key] = currentElement.is(':checked');
          } else {
            currentObject[keys[i].key] = currentElement.val();
          }
        }
      }
      parentObject = currentObject;
      currentObject = currentObject[keys[i].key];
    }
    Session.set(keys[0].key, formObject);

  }
});

Template.engageCreate.helpers({
  getSelectedPoi: function () {
    var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
    return Session.get(sessionKey).selectedPoi;
  },

  getSelectedVisitorGroupHelpText: function () {
    var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
    if (Session.get(sessionKey).selectedPoi) {
      var str = "Currently targeting ";
      var vg_interested = Template.visitorGroupSelector.visitorGroup.INTERESTED;
      if (Session.get(sessionKey).visitorGroup === vg_interested) {
        str = str + "\<br>\<b>" + Session.get(sessionKey).selectedPoi.interestedVisitors + "\</b> " + "interested ";
      } else {
        str = str + "\<br>\<b>" + Session.get(sessionKey).selectedPoi.totalVisitors + "\</b> ";
      }
      str = str + "visitors.";

      return str;

    } else {
      return "None selected.";
    }
  },

  getScheduleHelpText: function () {
    var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
    var formData = Session.get(sessionKey);

    if (Session.get(sessionKey).type === Template.budgetFiller.type.lifetime) {

      return "";

    } else {
      var s = "\Max\.spending will be: \<b>";
      var sDate = moment(Session.get(sessionKey).startDate);
      var eDate = moment(Session.get(sessionKey).endDate);
      var amount = Session.get(sessionKey).amount;
      s = s + "HKD " + _.numberFormat(+amount * eDate.diff(sDate, "day")) + "\</b>";

      return s;

    }
  }

});

Template.engageCreate.created = function () {
  var self = this;
  var sessionKey = Template.engageCreate.FORM_SESSION_KEY;
  var s = {
    startDate: moment().format("YYYY-MM-DD"),
    visitorGroup: Template.visitorGroupSelector.visitorGroup.INTERESTED,
    amount: 200,
    type: Template.budgetFiller.type.perDay
  };
  if (Iron.controller().state.get("selectedPoiId")) {
    var sp = _.first(_.filter(PoisMetric.get().pois,
      function(p) {
        return p._id === Iron.controller().state.get("selectedPoiId");
      }
    ));
    s = _.extend({}, s, { "selectedPoi" : Template.poiNameSelector.toSelectorObj(sp) });
  }

  Session.setDefault(sessionKey, s);
};

Template.engageCreate.rendered = function() {

};
