Scheduler = {};

Scheduler.init = function () {
  _.each(this.jobs, function(job){
    console.log("[Scheduler] Adding job: " + job.name);
    SyncedCron.add({
      name: job.name,
      schedule: job.schedule,
      job: job.job
    });
  });
};

Scheduler.jobs = [
  {
    name: "Clear dangling journey encounters",
    schedule: function (parser) {
      return parser.text('every 2 hours');
    },
    job: function () {
      return Journeys.clearDanglingEncounters(moment());
    }
  },
  {
    name: "Recompute all poi interests",
    schedule: function (parser) {
      return parser.text('every 24 hours');
    },
    job: function () {
      return PoiInterests.recomputeAllJourneys();
    }
  }
];

Scheduler.start = function () {
  SyncedCron.start();
};

Meteor.startup(function() {
  Scheduler.init();
  Scheduler.start();
});
