Template.engageCreate.FORM_SESSION_KEY = "engageCreateForm";

Template.engageCreate.events({
  "click .create": function () {
    var formData = Session.get(Template.engageCreate.FORM_SESSION_KEY);
    Meteor.call("addEngagement", formData, function(e, r) {
      if (r) {
        console.log("added", r);
        var uploader = new Slingshot.Upload("engageCreateGraphic", { engagementId : r._id });
        var files = Dropzone.instances[0].files; //TODO look for better way
        //currently only handle 1 file
        uploader.send(files[0], function (error, downloadUrl) {
          r.imageUrl = downloadUrl;
          Meteor.call("upsertEngagement", r, function(e,r2) {
            if (r) {
              Notifications.info('Engagement Created', '');
              Session.set(Template.engageCreate.FORM_SESSION_KEY, Engagement.getDefault());
              window.history.back();
            } else {
              Notifications.error('Engagement Created Failed', '');
            }
          });
        });

      } else {
        Notifications.error('Engagement Created Failed', '');
      }
    });
  },
  "blur input, change input": function(e) {
    var cur = e.currentTarget;
    var currentObject = {};
    var rootKey = $(cur).data("id");
    while (cur) {
      var id = $(cur).data("id");
      if (id) {
        if (_.isEqual(currentObject,{})) {
          currentObject[id] = $(cur).is(":checkbox")? $(cur).is(':checked'): $(cur).val();
        } else {
          var newObject = {};
          newObject[id] = currentObject;
          currentObject = newObject;
        }
        rootKey = id;
      }
      cur = cur.parentNode;
    }
    Session.rextend(rootKey, currentObject[rootKey]);
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
      var vg_interested = Engagement.visitorGroup.INTERESTED;
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

    if (Session.get(sessionKey).type === Engagement.budgetType.LIFETIME) {

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
  var s = Engagement.getDefault();
  console.log("Created", Iron.controller().state.get("selectedPoiId"));
  if (Iron.controller().state.get("selectedPoiId")) {
    var sp = _.first(_.filter(PoisMetric.get().pois,
      function(p) {
        return p._id === Iron.controller().state.get("selectedPoiId");
      }
    ));
    console.log("sp", sp);
    s = _.extend({}, s, { "selectedPoi" : Template.poiNameSelector.toSelectorObj(sp) });
  }
  console.log(s);

  Session.set(sessionKey, s);
};

Template.engageCreate.destroyed = function() {
  Session.set(Template.engageCreate.FORM_SESSION_KEY, Engagement.getDefault());
};

Template.engageCreate.rendered = function() {
  var formData = Session.get(Template.engageCreate.FORM_SESSION_KEY);
  $('input[data-id]').each(function (i, e) {
    var keys = [$(e).data("id")];
    var cur = e;
    while (cur) {
      var id = $(cur).data("id");
      if (id) {
        keys = [id].concat(keys);
      }
      cur = cur.parentNode;
    }

    var currentData = formData;
    _.each(_.rest(keys), function (key) {
      if (_.isObject(currentData) && currentData.hasOwnProperty(key)) {
        currentData = currentData[key];
      } else {
        return;
      }
    });

    if (currentData !== null) {
      if ($(e).is(":checkbox")) {
        $(e).prop("checked", currentData);
      } else {
        $(e).val(currentData);
      }
    }

  });
};
