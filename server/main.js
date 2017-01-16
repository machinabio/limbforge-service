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
import { check } from 'meteor/check';
import opn from 'opn';

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

Api.addRoute('healthcheck', {
  get: () => {
    return 'OK';
  }
});

Api.addRoute('limbforge', {
  get: function() {
    var data = this.queryParams.parametersl
    console.log('/api/submit #### data: ', data);

    if (!Match.test(data, Object)) {}
        console.log('...Object not found. Checking for URLEncoding');
        try {
        data = EJSON.parse(this.queryParams.parameters);
        check(data, Object);
        console.log('...Success! Found URLEncoded object.')
        }
        catch (error) {
            console.error('...Failure! No object data found');
        }

    Messages.insert({
      content: EJSON.stringify(data),
      time: new Date()
    });

    opn("fusion360://command=open&file=UUID.stl&id=foobar&");
    return 'OK';
  }
});

Meteor.methods({
  sendToFusion: function(data) {
    console.log('Sending data: ', data);
    HTTP.get('http://localhost:3000/api/limbforge', {
      params: { parameters: EJSON.stringify(data) }
    })
  }
});
