JSON.importOrganizationsFromUrl = function (jsonURL) {
  var json = JSON.read(jsonURL);
  _.each(json.organizations, function (organizationJSON) {
    Organizations.import(organizationJSON);
  });
};

JSON.read = function (jsonURL) {
  var data = HTTP.get(jsonURL);
  return JSON.parse(data.content);
};
