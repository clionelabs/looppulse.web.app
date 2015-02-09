if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function(){
    beforeEach(function () {
      organizationJSON = {
        "name": "Testing Organization",
        "users": [
          {"email": "testing@looppulse.com", "password": "1234"}
        ],
        "workspaces": [
          {
            "name": "Testing Workspace",
            "poiDescriptors": {"one" : "restaurant", "many" :"restaurants"},
            "applications": [
              {
                "name": "Android SDK",
                "id": "KSxRAjBFQZ38n5TFx",
                "token": "wefijoweifj"
              },
              {
                "name": "Simulator",
                "id": "A3TkwtvBNxAC4eq4a",
                "token": "sdlfkjwoeif"
              }
            ],
            "pois": [
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
            ],
            "geofences": [
              {"lat": 22.287583, "lng": 114.213133, "radius": 20},
              {"lat": 22.303868, "lng": 114.252089, "radius": 10}
            ]
          }
        ]
      };

      Organizations.remove({});
      Workspaces.remove({});
      Applications.remove({});
      Meteor.users.remove({});
      Pois.remove({});
      Geofences.remove({});

      should = chai.should();
      chai.use(sinonChai);
    });

    describe('Organizations.improt', function () {
      it('skips if organization has been previously created', function () {
        var wsSpy = sinon.spy(Workspaces, 'insert');
        Organizations.insert({name: organizationJSON.name});

        Organizations.import(organizationJSON);
        wsSpy.called.should.be.false;
      });

      it('imports one organization and related collections', function () {
        Organizations.import(organizationJSON);

        Organizations.find().count().should.equal(1);
        Workspaces.find().count().should.equal(1);
        Applications.find().count().should.equal(2);
        Meteor.users.find().count().should.equal(1);
        Pois.find().count().should.equal(3);
        Geofences.find().count().should.equal(2);
      });
    });
  });
}
