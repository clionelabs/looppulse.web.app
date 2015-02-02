
var unauthorized = function (route) {
  if (route) { _.extend(this, route);}
  var requestMethod = this.request.method;
  console.warn("[API] Unsupported method: " + requestMethod);
  this.response.writeHead(405, {'Content-Type': 'text/html'});
  this.response.end('<html><body>Unsupported method: ' + requestMethod + '</body></html>');
}

Router.route('/api/authenticate/applications/:applicationId',
  {
    where: 'server',
    //use onBeforeAction for now as iron-router doesn't auto block undefined HTTP method
    onBeforeAction: function() {
      if (this.request.method !== 'POST') {
        unauthorized(this);
      } else {
        this.next();
      }
    }
  })
    .post(function() {
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
    });
