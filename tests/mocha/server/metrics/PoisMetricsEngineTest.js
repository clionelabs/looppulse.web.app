if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function(){
    describe("PoisMetricsEngine", function() {
      // A base date - can be anything
      var baseDate = moment('2014-01-01 00:00:00.000');

      // Insert a few POIs for testing
      var beaconBase = {uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 1};
      var pois = [];
      for (var i = 1; i <= 5; i++) {
        var id = Pois.insert({name: "test-poi-" + i, beacon: _.extend({}, beaconBase, {minor: i})});
        pois.push(Pois.findOne(id));
      }

      // helper function to get a moment object with baseDate
      var getBaseDate = function() {
        return moment(baseDate);
      };

      // pre-defined current time
      var current = getBaseDate().add(1, 'd');
      var msSinceBase = current.diff(getBaseDate());

      // helper function to create encounter by just taking a number of miliseconds passed the base date
      var getEncounter = function(enteredAtSince, exitedAtSince) {
        var enteredAt = getBaseDate().add(enteredAtSince).valueOf();
        var exitedAt = exitedAtSince === null? null: getBaseDate().add(exitedAtSince).valueOf();
        return {enteredAt: enteredAt, exitedAt: exitedAt};
      };

      beforeEach(function() {
        Journeys.remove({});
      });

      it("single poi - single visitor - no encounters", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: []});
        var engine = new PoisMetricEngine([pois[0]], current);
        chai.assert.equal(engine.computeTotalVisitorsCnt(), 1);
        chai.assert.equal(engine.computeCurrentVisitorsCnt(), 0);
        chai.assert.equal(engine.computeAvgDwellTime(), 0);
      });

      it("single poi - single visitor - one closed encounter", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(0, 10)]});
        var engine = new PoisMetricEngine([pois[0]], current);
        chai.assert.equal(engine.computeTotalVisitorsCnt(), 1);
        chai.assert.equal(engine.computeCurrentVisitorsCnt(), 0);
        chai.assert.equal(engine.computeAvgDwellTime(), 10);
      });

      it("single poi - single visitor - one opened encounter", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(0, null)]});
        var engine = new PoisMetricEngine([pois[0]], current);
        chai.assert.equal(engine.computeTotalVisitorsCnt(), 1);
        chai.assert.equal(engine.computeCurrentVisitorsCnt(), 1);
        chai.assert.equal(engine.computeAvgDwellTime(), 24 * 60 * 60 * 1000); // current time is 1 day from base date
      });

      it("single poi - single visitor - multiple encounters", function() {
        // two closed encounters + 1 open
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(0, 10), getEncounter(20, 40), getEncounter(60, null)]});
        var engine = new PoisMetricEngine([pois[0]], current);
        chai.assert.equal(engine.computeTotalVisitorsCnt(), 1);
        chai.assert.equal(engine.computeCurrentVisitorsCnt(), 1);
        chai.assert.equal(engine.computeAvgDwellTime(), (10 + 20 + (msSinceBase - 60)));
      });

      it("single poi - multiple visitors - multiple encounters", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(0, 10), getEncounter(20, 40)]});
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '2', encounters: [getEncounter(0, null)]});
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '3', encounters: [getEncounter(10, null)]});
        var engine = new PoisMetricEngine([pois[0]], current);
        chai.assert.equal(engine.computeTotalVisitorsCnt(), 3);
        chai.assert.equal(engine.computeCurrentVisitorsCnt(), 2);
        chai.assert.equal(engine.computeAvgDwellTime(), Math.floor(((10 + 20) + (msSinceBase) + (msSinceBase - 10))/3));
      });

      it("multiple poi - single visitor", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(0, null)]});
        Journeys.insert({poiId: pois[1]._id, visitorUUID: '1', encounters: [getEncounter(10, null)]});
        var engine = new PoisMetricEngine([pois[0], pois[1]], current);
        chai.assert.equal(engine.computeTotalVisitorsCnt(), 1);
        chai.assert.equal(engine.computeCurrentVisitorsCnt(), 1);
        chai.assert.equal(engine.computeAvgDwellTime(), Math.floor((msSinceBase + (msSinceBase - 10))/2));
      });

      it("multiple poi - multiple visitors - multiple encounters", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(0, 10), getEncounter(20, 40)]});
        Journeys.insert({poiId: pois[1]._id, visitorUUID: '2', encounters: [getEncounter(0, null)]});
        Journeys.insert({poiId: pois[1]._id, visitorUUID: '3', encounters: [getEncounter(10, null)]});
        Journeys.insert({poiId: pois[2]._id, visitorUUID: '3', encounters: [getEncounter(0, 20)]});
        var engine = new PoisMetricEngine(pois, current);
        chai.assert.equal(engine.computeTotalVisitorsCnt(), 3);
        chai.assert.equal(engine.computeCurrentVisitorsCnt(), 2);
        chai.assert.equal(engine.computeAvgDwellTime(), Math.floor(((10 + 20) + (msSinceBase) + (msSinceBase - 10) + 20)/4));
      });
    });
  });
}
