import { Meteor } from 'meteor/meteor';
import { open } from 'openurl';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import { Messages } from '/imports/messages.js';
import Request from 'request';
import Archiver from 'archiver';
import Fiber from 'fibers';
import fs from 'fs';
import tmp from 'tmp';
import s3Zip from 's3-zip';
import path from 'path';
import AWS from 'aws-sdk';
import send from 'send';
import { Dashboard } from '/imports/dashboard.js';
import { CadMake } from '/imports/cadmake.js';
import { check } from 'meteor/check';
import opn from 'opn';
import Agent from '/imports/api/agents.js';
import Script from '/imports/api/scripts.js';
import '/imports/startup.js';
import '/imports/api/agent-factory.js';
import '/imports/api/agent-mock.js';
import '/imports/api/job-queue.js';
import Params from '/imports/parameters.js';
import 'meteor/yogiben:mixpanel';
import Transaction from '/imports/models/transaction.js';

const settings = Meteor.settings.AWS;

AWS.config = new AWS.Config();
AWS.config.accessKeyId = settings.accessKeyId;
AWS.config.secretAccessKey = settings.secretAccessKey;
AWS.config.region = settings.AWS;

Meteor.startup(() => {

  // Whatever code is needed to startup the server goes here
});

let Api = new Restivus({
  prettyJson: true
});

var microserverReady = true;

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

Api.addRoute('rex/:hash', {
  post: function() {
    console.log('rex id:', this.urlParams.hash);
    let script = Script.findOne({ _md5: this.urlParams.hash, published: true });
    if (script) {
      var data = this.bodyParams ? this.bodyParams : {};
      console.log('rex data:', data);
      let params = {
        script_id: script._id,
        data: data
      }
      this.response.writeHead(200, 'retrieving id', {
        'Content-Type': 'application/json'
      });
      Meteor.call('rex_enqueue', params, (error, result) => {
        let transaction = Transaction.findOne(result);
        console.log('rex_enqueue result was ', transaction);
        this.response.write(EJSON.stringify(transaction));
        this.done();
      });
    } else {
      return {
        statusCode: 501,
        body: 'Script not found'
      }
    }
  },
  get: function() {
    return {
      statusCode: 405,
      body: 'GET method not supported. Try POST instead.'
    };
  }
});

Api.addRoute('limbforge', {
  get: function() {
    var data = this.queryParams.parameters;
    console.log('/api/submit #### data: ', data);

    if (!Match.test(data, Object)) {}
    console.log('...Object not found. Checking for URLEncoding');
    try {
      data = EJSON.parse(this.queryParams.parameters);
      check(data, Object);
      console.log('...Success! Found URLEncoded object.')
    } catch (error) {
      console.error('...Failure! No object data found');
    }

    Messages.insert({
      content: EJSON.stringify(data),
      time: new Date()
    });

    // opn("fusion360://command=open&file=UUID.stl&id=mytester&privateInfo=" + EJSON.stringify(data));
    return 'ok';
  }
});

// Meteor.methods({
//   sendToFusion: function(data) {
//     console.log('Sending data: ', data);
//     HTTP.get('http://localhost:3000/api/limbforge', {
//       params: { parameters: EJSON.stringify(data) }
//     })
//   }
// });
