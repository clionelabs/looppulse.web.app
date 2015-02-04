if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function(){
    beforeEach(function () {
      Workspaces.remove({});
      Pois.remove({});

      should = chai.should();
      chai.use(sinonChai);
    });

    describe('Pois.bulkCreate', function () {
      beforeEach(function () {
        validWorkspaceId = Workspaces.insert({organizationId: 'blah', name: 'Workspace'});
        validPois = [
                      {"name": "poi1",
                        "beacon": {
                          "uuid": "a2dca1e4-0607-4f37-9ff1-825237b278fe",
                          "major": 214,
                          "minor": 2104
                        }
                      },
                      {"name": "poi2",
                        "beacon": {
                          "uuid": "a2dca1e4-0607-4f37-9ff1-825237b278fe",
                          "major": 1901,
                          "minor": 102
                        }
                      },
                      {"name": "poi3",
                        "beacon": {
                          "uuid": "b9407f30-f5f8-466e-aff9-25556b57fe6d",
                          "major": 29622,
                          "minor": 5424
                        }
                      }
                    ];
      });

      it('throws error with invalid workspace ID', function () {
        var badWorkspaceId = 'bad one';

        chai.expect(function() {
          Pois.bulkCreate(badWorkspaceId, []);
        }).to.throw();
      });

      it('validates creation parameters', function () {
        var spy = sinon.spy(Pois, 'validate');
        
        Pois.bulkCreate(validWorkspaceId, validPois);
        spy.called.should.be.true;
      });

      it('creates n number of pois', function () {
        var created = Pois.bulkCreate(validWorkspaceId, validPois);
        created.should.equal(validPois.length);
      });

      it('creates given pois', function () {
        Pois.bulkCreate(validWorkspaceId, validPois);

        _.each(validPois, function(poi) {
          var obj = Pois.findOne(poi);
          should.exist(obj);
        });
      });
    });

    describe('Pois.validate', function () {
      it('throws error with invalid poi info', function () {
        // Missing name
        chai.expect(function() {
          var badPois = { beacon: {uuid: 'uuid', major: 123, minor: 456} };
          Pois.validate(badPois);
        }).to.throw();

        // Missing poi
        chai.expect(function() {
          var badPois = { name: 'bad poi' };
          Pois.validate(badPois);
        }).to.throw();

        // Missing uuid
        chai.expect(function() {
          var badPois = { name: 'bad poi',
                          beacon: {major: 123, minor: 456} };
          Pois.validate(badPois);
        }).to.throw();

        // uuid is not a string
        chai.expect(function() {
          var badPois = { name: 'bad poi',
                          beacon: {uuid: 1, major: 123, minor: 456} };
          Pois.validate(badPois);
        }).to.throw();

        // major or minor is not a number
        chai.expect(function() {
          var badPois = { name: 'bad poi',
                          beacon: {uuid: 'uuid', major: '123', minor: '456'} };
          Pois.validate(badPois);
        }).to.throw();
      });
    });
  });
}
