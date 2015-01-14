if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function(){
    describe("Journeys", function() {
      var poiId = '1';
      var visitorUUID = '1';
      var baseDate = moment('2014-01-01 00:00:00.000');
      var beacon = {uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', major: 1, minor: 1};
      var getBaseDate = function() {
        return moment(baseDate);
      };
      var getBeaconEvent = function(type, createdAt) {
        var beaconEvent = new BeaconEvent({
          beacon: beacon,
          type: type,
          visitorUUID: visitorUUID,
          createdAt: createdAt
        });
        return beaconEvent;
      };
      var getEnterBeaconEvent = function(createdAt) {
        return getBeaconEvent('didEnterRegion', createdAt);
      };
      var getExitBeaconEvent = function(createdAt) {
        return getBeaconEvent('didExitRegion', createdAt);
      };

      Pois.insert({name: "demo poi", beacon: beacon});

      beforeEach(function() {
        Journeys.remove({});
      });

      it("handleBeaconEvent - poi not found", function() {
        var createdAt = getBaseDate().valueOf();
        var be = new BeaconEvent({
          beacon: {uuid: 'not-existed', major: 1, minor: 1},
          type: 'didEnterRegion',
          visitorUUID: visitorUUID,
          createdAt: createdAt
        });
        Journeys.handleNewBeaconEvent(be);
        chai.assert.equal(Journeys.find().count(), 0);
      });

      it("handleBeaconEvent - first ENTER", function() {
        var createdAt = getBaseDate().valueOf();
        var be = getEnterBeaconEvent(createdAt);
        Journeys.handleNewBeaconEvent(be);

        chai.assert.equal(Journeys.find().count(), 1);
        var journey = Journeys.findOne();
        chai.assert.equal(journey.visitorUUID, visitorUUID);
        chai.assert.equal(journey.encounters.length, 1);
        chai.assert.deepEqual(journey.encounters[0], {enteredAt: createdAt, exitedAt: null, duration: null});
      });

      it("handleBeaconEvent - first EXIT", function() {
        var createdAt = getBaseDate().valueOf();
        var be = getExitBeaconEvent(createdAt);
        Journeys.handleNewBeaconEvent(be);

        chai.assert.equal(Journeys.find().count(), 0);
      });

      it("handleBeaconEvent - ENTER on an opening encounter", function() {
        // An EXIT event might have lost for the first ENTER. So we remove the first one, and start over with the second.
        var createdAt1 = getBaseDate().valueOf();
        var createdAt2 = getBaseDate().add(10, 's').valueOf();
        var be1 = getEnterBeaconEvent(createdAt1);
        var be2 = getEnterBeaconEvent(createdAt2);
        Journeys.handleNewBeaconEvent(be1);
        Journeys.handleNewBeaconEvent(be2);

        chai.assert.equal(Journeys.find().count(), 1);
        var journey = Journeys.findOne();
        chai.assert.equal(journey.visitorUUID, visitorUUID);
        chai.assert.equal(journey.encounters.length, 1);
        chai.assert.deepEqual(journey.encounters[0], {enteredAt: createdAt2, exitedAt: null, duration: null});
      });

      it("handleBeaconEvent - EXIT on an opening encounter", function() {
        // Normal scenario - expect the encounter be closedr
        var enteredAt1 = getBaseDate().valueOf();
        var exitedAt1 = getBaseDate().add(10, 's').valueOf();
        var be1 = getEnterBeaconEvent(enteredAt1);
        var be2 = getExitBeaconEvent(exitedAt1);
        Journeys.handleNewBeaconEvent(be1);
        Journeys.handleNewBeaconEvent(be2);

        chai.assert.equal(Journeys.find().count(), 1);
        var journey = Journeys.findOne();
        chai.assert.equal(journey.visitorUUID, visitorUUID);
        chai.assert.equal(journey.encounters.length, 1);
        chai.assert.deepEqual(journey.encounters[0], {enteredAt: enteredAt1, exitedAt: exitedAt1, duration: 10});
      });

      it("handleBeaconEvent - EXIT on an closed encounter", function() {
        // Create a closed encounter
        var enteredAt1 = getBaseDate().valueOf();
        var exitedAt1 = getBaseDate().add(10, 's').valueOf();
        var be1 = getEnterBeaconEvent(enteredAt1);
        var be2 = getExitBeaconEvent(exitedAt1);
        Journeys.handleNewBeaconEvent(be1);
        Journeys.handleNewBeaconEvent(be2);

        // A new EXIT event. This should be ignored.
        var exitedAt2 = getBaseDate().add(20, 's').valueOf();
        var be3 = getExitBeaconEvent(exitedAt2);
        Journeys.handleNewBeaconEvent(be3);

        // Result - only the initial closed encounter matters
        chai.assert.equal(Journeys.find().count(), 1);
        var journey = Journeys.findOne();
        chai.assert.equal(journey.visitorUUID, visitorUUID);
        chai.assert.equal(journey.encounters.length, 1);
        chai.assert.deepEqual(journey.encounters[0], {enteredAt: enteredAt1, exitedAt: exitedAt1, duration: 10});
      });

      it("handleBeaconEvent - ENTER on an closed encounter - beyond grace period", function() {
        // Create a closed encounter
        var enteredAt1 = getBaseDate().valueOf();
        var exitedAt1 = getBaseDate().add(10, 's').valueOf();
        var be1 = getEnterBeaconEvent(enteredAt1);
        var be2 = getExitBeaconEvent(exitedAt1);
        Journeys.handleNewBeaconEvent(be1);
        Journeys.handleNewBeaconEvent(be2);

        // A new ENTER event.
        var enteredAt2 = getBaseDate().add(10 + Journeys.GRACE_PERIOD_IN_SEC, 's').valueOf();
        var be3 = getEnterBeaconEvent(enteredAt2);
        Journeys.handleNewBeaconEvent(be3);

        // Result - a closed encounter, plus another opened encounter
        chai.assert.equal(Journeys.find().count(), 1);
        var journey = Journeys.findOne();
        chai.assert.equal(journey.visitorUUID, visitorUUID);
        chai.assert.equal(journey.encounters.length, 2);
        chai.assert.deepEqual(journey.encounters[0], {enteredAt: enteredAt1, exitedAt: exitedAt1, duration: 10});
        chai.assert.deepEqual(journey.encounters[1], {enteredAt: enteredAt2, exitedAt: null, duration: null});
      });

      it("handleBeaconEvent - ENTER on an closed encounter - within grace period", function() {
        // Create a closed encounter
        var enteredAt1 = getBaseDate().valueOf();
        var exitedAt1 = getBaseDate().add(10, 's').valueOf();
        var be1 = getEnterBeaconEvent(enteredAt1);
        var be2 = getExitBeaconEvent(exitedAt1);
        Journeys.handleNewBeaconEvent(be1);
        Journeys.handleNewBeaconEvent(be2);

        // A new ENTER event.
        var enteredAt2 = getBaseDate().add(10 + Journeys.GRACE_PERIOD_IN_SEC - 1, 's').valueOf();
        var be3 = getEnterBeaconEvent(enteredAt2);
        Journeys.handleNewBeaconEvent(be3);

        // Result - an open encounter (the first EXIT and second ENTER are not counted);
        chai.assert.equal(Journeys.find().count(), 1);
        var journey = Journeys.findOne();
        chai.assert.equal(journey.visitorUUID, visitorUUID);
        chai.assert.equal(journey.encounters.length, 1);
        chai.assert.deepEqual(journey.encounters[0], {enteredAt: enteredAt1, exitedAt: null, duration: null});
      });
    });
  });
}
