if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function(){
    beforeEach(function () {
      jsonURL = 'https://s3-ap-southeast-1.amazonaws.com/looppulse-app-dev/testing.json';
      json = {
        "organizations": [
          {
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
                    "token": "wefijoweifj"
                  },
                  {
                    "name": "Simulator",
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
          }
        ]
      };

      should = chai.should();
      chai.use(sinonChai);
    });

    describe('JSON.importOrganizationsFromUrl', function () {
      beforeEach(function () {
        sinon.stub(HTTP, 'get', function (url) {
          return { content: JSON.stringify(json) };
        });
      });

      afterEach(function () {
        HTTP.get.restore();
      })

      it('reads from a JSON online and import organization', function () {
        var readSpy = sinon.spy(JSON, 'read');
        var importSpy = sinon.spy(Organizations, 'import');

        JSON.importOrganizationsFromUrl(jsonURL);
        readSpy.called.should.be.true;
        importSpy.called.should.be.true;
      });
    });

    describe('JSON.read', function () {
      it('returns a JSON object', function () {
        JSON.stringify(JSON.read(jsonURL)).
          should.equal(JSON.stringify(json));
      });
    });
  });
}
