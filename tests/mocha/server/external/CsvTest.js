if (!(typeof MochaWeb === 'undefined')) {
  MochaWeb.testOnly(function(){
    beforeEach(function () {
      csvURL = 'https://s3-ap-southeast-1.amazonaws.com/looppulse-app-dev/k11.csv';
      csvString = 'major, minor, uuid, name\nDAF9, F14A, 23a01af0-232a-4518-9c0e-0117c5315864, K11 Select inside\n644D, F934, 23a01af0-232a-4518-9c0e-0117c53dbaa7, B2N4 Entrance\nA07F, 6C3D, 23a01af0-232a-4518-9c0e-0117c532dfe8, B207 Entrance\n409B, 2006, 23a01af0-232a-4518-9c0e-0117c53424a5, L3 CS Counter\nB94E, A2D9, 23a01af0-232a-4518-9c0e-0117c53d49e2, L3 Tin Cheung\n8B69, AFE2, 23a01af0-232a-4518-9c0e-0117c537a919, K11 DesignStore\n840B, 7DBB, 23a01af0-232a-4518-9c0e-0117c53f0f02, G/F CS Counter\nEBC1, 0A63, 23a01af0-232a-4518-9c0e-0117c53b50ef, B207 Inside\nC428, 6BAC, 23a01af0-232a-4518-9c0e-0117c53eb544, L2 East Ocean\n15B3, D9BA, 23a01af0-232a-4518-9c0e-0117c5364d38, B3 CarPark\n';
      should = chai.should();
      chai.use(sinonChai);
    });

    describe('BulkCreatePois', function () {
      beforeEach(function () {
        validWorkspaceId = Workspaces.insert({organizationId: 'blah', name: 'Workspace'});
        validCSV = csvURL;

        sinon.stub(HTTP, 'get', function (url) {
          return { content: csvString };
        });
      });

      afterEach(function () {
        HTTP.get.restore();
      })

      it('throws error with invalid workspace ID', function () {
        var badWorkspaceId = 'bad one';

        chai.expect(function() {
          CSV.bulkCreatePois(badWorkspaceId, validCSV);
        }).to.throw();
      });

      it('reads from a CSV, convert content from JSON and bulk create POIs', function () {
        var readSpy = sinon.spy(CSV, 'import');
        var parseSpry = sinon.spy(Baby, 'parse');
        var createSpy = sinon.spy(Pois, 'bulkCreate');
        var sanitizeSpy = sinon.spy(CSV, 'sanitizePois');

        CSV.bulkCreatePois(validWorkspaceId, validCSV);
        readSpy.called.should.be.true;
        parseSpry.called.should.be.true;
        createSpy.called.should.be.true;
        sanitizeSpy.called.should.be.true;
      });
    });

    describe('CSV.import', function () {
      it('reads from a CSV online resource', function () {
        var content = CSV.import(csvURL);
        content.should.equal(csvString);
      });
    });

    describe('CSV.sanitizePois', function () {
      beforeEach(function () {
        parsed = Baby.parse(csvString, CSV.parseOptions);
      });

      it('sanitizes key and value before importing', function () {
        var keySpy = sinon.spy(CSV, 'sanitizeKey');
        var valueSpy = sinon.spy(CSV, 'sanitizeValue');
        var data = [{'key': 'value'}];

        var sanitized = CSV.sanitizePois(data);
        keySpy.calledWith('key').should.be.true;
        valueSpy.calledWith('value').should.be.true;
      });

      it('sanitizes pois for importing', function () {
        var sanitized = CSV.sanitizePois(parsed.data);
        sanitized.length.should.equal(parsed.data.length);
        _.each(sanitized, function (poi) {
          chai.expect(function() {
            Pois.validate(poi);
          }).to.not.throw();
        });
      });
    });

    describe('CSV.sanitizeKey', function () {
      it('removes leading and trailing spaces', function () {
        CSV.sanitizeKey('  key   ').should.equal('key');
      });

      it('lower cases', function () {
        CSV.sanitizeKey('KEY').should.equal('key');
      });
    });

    describe('CSV.sanitizeValue', function () {
      it('removes leading and trailing spaces', function () {
        CSV.sanitizeValue('  testing 1 2 3 ').should.equal('testing 1 2 3');
      });

      it('does not change cases', function () {
        CSV.sanitizeValue('Value').should.equal('Value');
      });
    });
  });
}
