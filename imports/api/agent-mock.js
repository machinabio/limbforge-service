let Api = new Restivus({
  prettyJson: true,
  apiPath: ''
});

Api.addRoute('test.js', {
  get: function () {
  	// console.log('serving mock js script');
  	return "";
  }
});

// console.log('setup mock script endpoints');