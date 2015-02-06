CSV = {};

CSV.bulkCreatePois = function (workspaceId, csvURL) {
  var csvString = CSV.read(csvURL);
  var results = Baby.parse(csvString, CSV.parseOptions);
  var sanitized = CSV.sanitizePois(results.data);
  return Pois.bulkCreate(workspaceId, sanitized);
};

CSV.parseOptions = {header: true, dynamicTyping: true, skipEmptyLines: true};

CSV.read = function (csvURL) {
  var data = HTTP.get(csvURL);
  return data.content;
};

CSV.sanitizePois = function (unsanitizedPois) {
  var pois = [];
  _.each(unsanitizedPois, function (unsanitized) {
    var poi = {};
    _.each(Object.keys(unsanitized), function (badKey) {
      var key = CSV.sanitizeKey(badKey);
      var value = CSV.sanitizeValue(unsanitized[badKey]);
      poi[key] = value;
    });
    poi.beacon = { uuid: poi.uuid,
                   major: parseInt(poi.major, 16),
                   minor: parseInt(poi.minor, 16) };
    delete poi.uuid;
    delete poi.major;
    delete poi.minor;
    pois.push(poi);
  });
  return pois;
};

// CSV parser sometimes returns key with leading spaces
CSV.sanitizeKey = function (unsanitizedKey) {
  return unsanitizedKey.replace(/\s/g, '').toLowerCase();
};

CSV.sanitizeValue = function (unsanitizedValue) {
  return unsanitizedValue.toString().trim();
};
