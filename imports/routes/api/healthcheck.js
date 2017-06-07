let Api = new Restivus({
  prettyJson: true
});


let microserverReady = true;

Api.addRoute('healthcheck', {
  get: function() {
    if (microserverReady) {
      return 'ok';
    } else {
      return {
        statusCode: 503,
        body: 'busy'
      };
    }
  },
  post: function() {
    if (microserverReady) {
      return 'ok';
    } else {
      return {
        statusCode: 503,
        body: 'busy'
      };
    }
  }
});
