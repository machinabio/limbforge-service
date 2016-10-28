import { Meteor } from 'meteor/meteor';

var openurl = require('openurl').open;

Meteor.startup(() => {
  // code to run on server at startup
});

let Api = new Restivus({
  prettyJson: true
});

Api.addRoute('healthcheck', {
  get: () => {
    return 'OK';
  }
});

Api.addRoute('submit', {
  post: function() {
    var data = this.bodyParams;
    console.log('/api/submit #### data: ', data);
    openurl('fusion360://command=open&file=/dev/null.f3d&privateInfo=' + JSON.stringify(data));
    return data;
  }
})

Meteor.methods({
  sendToFusion: function(data) {
  	console.log('Sending data: ', data);
    openurl('fusion360://command=open&file=/dev/null.f3d&privateInfo=' + JSON.stringify(data));
  }
})
