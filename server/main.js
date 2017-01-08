import { Meteor } from 'meteor/meteor';
import { open } from 'openurl';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import { Messages } from '/imports/messages.js';

Meteor.startup(() => {
    // Whatever code is needed to startup the server goes here
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
    var message = {};
    message.content = EJSON.stringify(data);
    message.time = new Date();
    Messages.insert(message);
    // open('fusion360://command=open&file=/dev/null.f3d&privateInfo=' + JSON.stringify(data));
    return 'ok';
  }
})

Meteor.methods({
  sendToFusion: function(data) {
  	console.log('Sending data: ', data);
    HTTP.post('http://localhost:3000/api/submit', {data: data})
    // openurl('fusion360://command=open&file=/dev/null.f3d&privateInfo=' + JSON.stringify(data));
  }
})
