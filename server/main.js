import { Meteor } from 'meteor/meteor';
import { open } from 'openurl';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import { check } from 'meteor/check';

import Request from 'request';
import Archiver from 'archiver';
import Fiber from 'fibers';
import fs from 'fs';
import tmp from 'tmp';
import s3Zip from 's3-zip';
import path from 'path';
import AWS from 'aws-sdk';
import opn from 'opn';

import { analytics } from "meteor/okgrow:analytics";

import Agent from '/imports/api/agents.js';
import Script from '/imports/api/scripts.js';
import Transaction from '/imports/models/transaction.js';

import '/imports/startup.js';
import '/imports/api/agent-factory.js';
import '/imports/api/job-queue.js';

const settings = Meteor.settings.AWS;

AWS.config = new AWS.Config();
AWS.config.accessKeyId = settings.accessKeyId;
AWS.config.secretAccessKey = settings.secretAccessKey;
AWS.config.region = settings.AWS;

if (process.env.NODE_ENV === "development") {
  METEORTOYSSHELL = true;
}


Meteor.startup(() => {
  // Whatever code is needed to startup the server goes here
});

//Restivus is a global. See https://github.com/kahmali/meteor-restivus
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
    // console.log('rex id:', this.urlParams.hash);
    //TODO add logging to analytics
    let script = Script.findOne({ _md5: this.urlParams.hash, published: true });
    if (script) {
      var data = this.bodyParams ? this.bodyParams : {};
      // console.log('rex data:', data);
      let params = {
        script_id: script._id,
        data: data
      }
      this.response.writeHead(200, 'retrieving id', {
        'Content-Type': 'application/json'
      });
      let transaction_id = Meteor.call('rex_enqueue', params);
      console.log('setting up observe for ', transaction_id);
      var fiber = Fiber.current;
      Transaction.find(transaction_id, { fields: { response: true } })
        .observeChanges({
          changed: () => {
            console.log('observed change in response');
            console.log(transaction_id);
            let transaction = Transaction.findOne(transaction_id);
            console.log(transaction);
            this.response.write(transaction.response);
            fiber.run(); 
          }
        });
      Fiber.yield(); 
      this.done();
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
