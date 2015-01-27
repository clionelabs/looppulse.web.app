var isPostRequest = function(request, response) {
  var requestMethod = request.method;
  return requestMethod !== "POST";
};

Router.route('authenticate', {
  path: '/api/authenticate/applications/:applicationId',
  where: 'server',
  action: function() {
    if (!isPostRequest(this.request, this.response)) {
      var requestMethod = request.method;
      console.warn("[API] Unsupported method: " + requestMethod);
      this.response.writeHead(405, {'Content-Type': 'text/html'});
      this.response.end('<html><body>Unsupported method: ' + requestMethod + '</body></html>');
      return;
    }

    var token = this.request.headers["x-auth-token"];
    var applicationId = this.params.applicationId;
    var capture = this.request.body.capture;
    var authenticatedResponse = Applications.authenticate(applicationId, token, capture);
    if (authenticatedResponse.statusCode != 200) {
      console.warn("[API] Application " + applicationId +
                   " failed to authenticate with token " + token +
                   " from " + JSON.stringify(this.request.headers));
    }
    this.response.writeHead(authenticatedResponse.statusCode,
                                {'Content-Type': 'application/json'});
    this.response.end(JSON.stringify(authenticatedResponse));
  }
});
