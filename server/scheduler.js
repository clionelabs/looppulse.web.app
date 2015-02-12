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
      console.log("[Scheduler] Running scheduled task: Clear Dangling Journey Encounter");
      return function() {Journeys.clearDanglingEncounters(moment());};
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
