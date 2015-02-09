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
        PoiInterests.remove({});
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

      it("peak visitors count - single visitor - single encounter", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(10, 20)]});
        var engine = new PoisMetricEngine([pois[0]], current);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add( 0), getBaseDate().add( 9)), 0);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add( 9), getBaseDate().add(11)), 1);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add(11), getBaseDate().add(19)), 1);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add(19), getBaseDate().add(21)), 1);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add(21), getBaseDate().add(30)), 0);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add( 0), getBaseDate().add(30)), 1);
      });

      it("peak visitors count - single visitor - two encounters", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(10, 20), getEncounter(30, 40)]});
        var engine = new PoisMetricEngine([pois[0]], current);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add( 0), getBaseDate().add(35)), 1);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add(21), getBaseDate().add(29)), 0);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add(15), getBaseDate().add(35)), 1);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add(25), getBaseDate().add(35)), 1);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add(25), getBaseDate().add(45)), 1);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add( 5), getBaseDate().add(55)), 1);
      });

      it("peak visitors count - two pois - single visitor - overlapped encounter", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(20, 40)]});
        Journeys.insert({poiId: pois[1]._id, visitorUUID: '1', encounters: [getEncounter(10, 30)]});
        var engine = new PoisMetricEngine([pois[0], pois[1]], current);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add( 0), getBaseDate().add(35)), 1);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add(15), getBaseDate().add(45)), 1);
      });

      it("peak visitors count - single poi - two visitors - overlapped encounter", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(20, 40)]});
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '2', encounters: [getEncounter(10, 30)]});
        var engine = new PoisMetricEngine([pois[0]], current);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add( 0), getBaseDate().add(15)), 1);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add(15), getBaseDate().add(35)), 2);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add(35), getBaseDate().add(45)), 1);
      });

      it("peak visitors count - multiple visitors - no overlap", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(10, 19), getEncounter(30, 39), getEncounter(50, 59)]});
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '2', encounters: [getEncounter(20, 24), getEncounter(40, 44)]});
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '3', encounters: [getEncounter(0, 9), getEncounter(25, 29), getEncounter(45, 49)]});
        var engine = new PoisMetricEngine(pois, current);
        chai.assert.equal(engine.computePeakVisitorsCnt(getBaseDate().add( 0), getBaseDate().add(100)), 1);
      });

      it("total visitor counts - poi filter", function() {
        Journeys.insert({poiId: pois[0]._id, visitorUUID: '1', encounters: [getEncounter(0, 10)]});
        Journeys.insert({poiId: pois[1]._id, visitorUUID: '2', encounters: [getEncounter(0, 10)]});
        Journeys.insert({poiId: pois[2]._id, visitorUUID: '3', encounters: [getEncounter(0, 10)]});
        var engine = new PoisMetricEngine(pois, current);
        chai.assert.equal(engine.computeTotalVisitorsCnt([pois[0]._id, pois[1]._id]), 2);
      });

      it("interested count - single poi - empty", function() {
        PoiInterests.insert({poiId: pois[0]._id, visitorUUIDs: []});
        var engine = new PoisMetricEngine(pois, current);
        chai.assert.equal(engine.computeInterestedCnt(), 0);
      });

      it("interested count - single poi - single interest", function() {
        PoiInterests.insert({poiId: pois[0]._id, visitorUUIDs: ['1']});
        var engine = new PoisMetricEngine(pois, current);
        chai.assert.equal(engine.computeInterestedCnt(), 1);
      });

      it("interested count - single poi - multiple interests", function() {
        PoiInterests.insert({poiId: pois[0]._id, visitorUUIDs: ['1', '2']});
        var engine = new PoisMetricEngine(pois, current);
        chai.assert.equal(engine.computeInterestedCnt(), 2);
      });

      it("interested count - multiple poi", function() {
        PoiInterests.insert({poiId: pois[0]._id, visitorUUIDs: ['1', '2']});
        PoiInterests.insert({poiId: pois[1]._id, visitorUUIDs: ['2', '3']});
        PoiInterests.insert({poiId: pois[2]._id, visitorUUIDs: ['3', '4']});
        var engine = new PoisMetricEngine(pois, current);
        chai.assert.equal(engine.computeInterestedCnt(), 4);
      });

      it("interested count - filter poi", function() {
        PoiInterests.insert({poiId: pois[0]._id, visitorUUIDs: ['1', '2']});
        PoiInterests.insert({poiId: pois[1]._id, visitorUUIDs: ['2', '3']});
        PoiInterests.insert({poiId: pois[2]._id, visitorUUIDs: ['3', '4']});
        var engine = new PoisMetricEngine(pois, current);
        chai.assert.equal(engine.computeInterestedCnt([pois[0]._id, pois[1]._id]), 3);
      });
    });
  });
}
