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
  get: function() {
    console.log('/api/submit #### data: ', this.queryParams.parameters);
    var data = EJSON.parse(this.queryParams.parameters);
    Messages.insert({
      content: EJSON.stringify(data),
      time: new Date()
    });
    
    var baseUrl = 'https://s3.amazonaws.com/limbforgestls'

    /// GET THE FOREARM
    var forearmFilename = [];
    forearmFilename.push('forearm_ebearm_');
    forearmFilename.push(data.orientation)
    forearmFilename.push('_C4-')
    forearmFilename.push(data.C4);
    forearmFilename.push('_L1-')
    forearmFilename.push(data.L1)
    forearmFilename.push('.stl');
    forearmFilename = forearmFilename.join('')

    var url = [];
    url.push(baseUrl);
    url.push('forearm/ebearm');
    url.push(data.orientation)
    url.push(forearmFilename)
    url = url.join('/')

    console.log('Generated forearm URL is ' + url);

    // var request = HTTP.get(url);

    /// GET THE TERMINAL
    var terminalFilename = [];
    terminalFilename.push('td_');
    terminalFilename.push(data.TD)
    terminalFilename.push('_')
    terminalFilename.push(data.orientation);
    terminalFilename.push('.stl');
    terminalFilename = terminalFilename.join('')

    var url = [];
    url.push(baseUrl);
    url.push('td');
    url.push(data.orientation)
    url.push(terminalFilename)
    url = url.join('/')

    console.log('Generated forearm URL is ' + url);
    // var request = HTTP.get(url);

    /// GET THE ADAPTOR
    var url = [];
    url.push(baseUrl);
    url.push('EbeArm');
    url.push('EbeArm_wrist_unit+v1.stl')
    url = url.join('/')

    console.log('Generated wrist URL is ' + url);

    // var request = HTTP.get(url);

    var response = {
      statusCode: 200,
      headers: {
        'Content-Disposition' : 'attachment; filename=' + forearmFilename,
        'Content-Type': 'application/vnd.ms-pkistl',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-requested-with' 
      },
      // body: request.content
      body: 'request.content'
    };

    // open('fusion360://command=open&file=/dev/null.f3d&privateInfo=' + JSON.stringify(data));
    return response;
  }
});

Meteor.methods({
  sendToFusion: function(data) {
    console.log('Sending data: ', data);
    HTTP.get('http://localhost:3100/api/submit', { params: {parameters: EJSON.stringify(data)}})
      // openurl('fusion360://command=open&file=/dev/null.f3d&privateInfo=' + JSON.stringify(data));
  }
});
