if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function(){
    describe("IsInterested", function() {
      // pre-defined current time; Any date is fine
      var current = moment("1995-12-25");

      // helper function to create encounter by just taking a number of seconds before current
      var getEncounter = function(enteredAtBefore, exitedAtBefore) {
        var enteredAt = moment(current).subtract(enteredAtBefore, 's').valueOf();
        var exitedAt = exitedAtBefore === null? null: moment(current).subtract(exitedAtBefore, 's').valueOf();
        return {enteredAt: enteredAt, exitedAt: exitedAt};
      };

      beforeEach(function() {
        Journeys.remove({});
        clock = sinon.useFakeTimers(current.valueOf());
      });

      afterEach(function () {
        clock.restore();
      })

      it("enough valid", function() {
        var encounters = [
          getEncounter(PoiInterests.THRESHOLD_WITHIN_SEC - 1, PoiInterests.THRESHOLD_WITHIN_SEC - 1 - PoiInterests.THRESHOLD_DURATION_SEC),
          getEncounter(PoiInterests.THRESHOLD_WITHIN_SEC - 1, PoiInterests.THRESHOLD_WITHIN_SEC - 1 - PoiInterests.THRESHOLD_DURATION_SEC)
        ];
        Journeys.insert({poiId: '1', visitorUUID: '1', encounters: encounters});
        var journey = Journeys.findOne();
        chai.assert.equal(PoiInterests.isInterested(journey), true);
      });

      it("not enough valid", function() {
        var encounters = [
          getEncounter(PoiInterests.THRESHOLD_WITHIN_SEC - 1, PoiInterests.THRESHOLD_WITHIN_SEC - 1 - PoiInterests.THRESHOLD_DURATION_SEC)
        ];
        Journeys.insert({poiId: '1', visitorUUID: '1', encounters: encounters});
        var journey = Journeys.findOne();
        chai.assert.equal(PoiInterests.isInterested(journey), false);
      });

      it("Invalid - not within", function() {
        var encounters = [
          getEncounter(PoiInterests.THRESHOLD_WITHIN_SEC + 1, PoiInterests.THRESHOLD_WITHIN_SEC + 1 - PoiInterests.THRESHOLD_DURATION_SEC),
          getEncounter(PoiInterests.THRESHOLD_WITHIN_SEC + 1, PoiInterests.THRESHOLD_WITHIN_SEC + 1 - PoiInterests.THRESHOLD_DURATION_SEC)
        ];
        Journeys.insert({poiId: '1', visitorUUID: '1', encounters: encounters});
        var journey = Journeys.findOne();
        chai.assert.equal(PoiInterests.isInterested(journey), false);
      });

      it("Invalid - not long enough", function() {
        var encounters = [
          getEncounter(PoiInterests.THRESHOLD_WITHIN_SEC - 1, PoiInterests.THRESHOLD_WITHIN_SEC - 1 - PoiInterests.THRESHOLD_DURATION_SEC + 1),
          getEncounter(PoiInterests.THRESHOLD_WITHIN_SEC - 1, PoiInterests.THRESHOLD_WITHIN_SEC - 1 - PoiInterests.THRESHOLD_DURATION_SEC + 1)
        ];
        Journeys.insert({poiId: '1', visitorUUID: '1', encounters: encounters});
        var journey = Journeys.findOne();
        chai.assert.equal(PoiInterests.isInterested(journey), false);
      });
    })
  })
}
