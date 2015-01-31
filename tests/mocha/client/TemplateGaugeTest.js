if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function() {
    describe("Template.gauge test suites", function() {
      before(function() {
        chai.should();
        chai.use(sinonChai);
      });

      /* TODO get chai-thing to work in meteor
       * Because now there is no good way to assert arrays
      it("pois list with more than 3 elements",function() {
        var fakePm = {
          totalVisitors : 20,
          pois : [
            { interestedVisitors : 1},
            { interestedVisitors : 2},
            { interestedVisitors : 3},
            { interestedVisitors : 4},
          ]
        };
        var result = Template.gauge.poisInterestedData(fakePm);
        result.should.all.be.equal([0.20, 0.15, 0.1, 0.05]);
      });

      it("pois list with 3 elements",function() {
        var fakePm = {
          totalVisitors : 20,
          pois : [
            { interestedVisitors : 1},
            { interestedVisitors : 2},
            { interestedVisitors : 3},
          ]
        };
        var result = Template.gauge.poisInterestedData(fakePm);
        result.should.all.be.equal([0.15, 0.1, 0.05]);
      });

      it("pois list with less than 3 elements",function() {
        var fakePm = {
          totalVisitors : 20,
          pois : [
            { interestedVisitors : 1},
            { interestedVisitors : 2},
          ]
        };
        var result = Template.gauge.poisInterestedData(fakePm);
        result.should.all.be.equal([0.1, 0.05]);
      });

      it("pois list with 0 element",function() {
        var fakePm = {
          totalVisitors : 0,
          pois : []
        };
        var result = Template.gauge.poisInterestedData(fakePm);
        result.should.be.equal([]);

      }); */
    });
  });
};
