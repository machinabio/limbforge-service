import { Meteor } from 'meteor/meteor';
import { open } from 'openurl';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import { Messages } from '/imports/messages.js';
import Request from 'request';
import Archiver from 'archiver';
import MultiStream from 'multistream';
import Fiber from 'fibers';
import fs from 'fs';
import tmp from 'tmp';
import s3Zip from 's3-zip';
import path from 'path';
import AWS from 'aws-sdk';
import send from 'send';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIAJMQ3NQ364UPGGBOA";
AWS.config.secretAccessKey = "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";
AWS.config.region = "us-east-1";

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

    /////////////////////////////////// 
    // PARSE PARAMETERS...
    ///////////////////////////////////
    var archiveFilename = 'limbforge.zip';


    var files = [];
    /////////////////////////////////// 
    // FOREARM
    ///////////////////////////////////
    var forearmFilename = [];
    forearmFilename.push('forearm_ebearm_');
    forearmFilename.push(data.orientation);
    forearmFilename.push('_C4-');
    forearmFilename.push(data.C4);
    forearmFilename.push('_L1-');
    forearmFilename.push(data.L1);
    forearmFilename.push('.stl');
    forearmFilename = forearmFilename.join('')

    var url = [];
    url.push('forearm/ebearm');
    url.push(data.orientation);
    url.push(forearmFilename);
    url = url.join('/');
    files.push(url);

    console.log('Generated forearm URL is ' + url);

    /////////////////////////////////// 
    // TERMINAL
    ///////////////////////////////////
    var terminalFilename = [];
    terminalFilename.push('td_');
    terminalFilename.push(data.TD);
    terminalFilename.push('_');
    terminalFilename.push(data.orientation);
    terminalFilename.push('.stl');
    terminalFilename = terminalFilename.join('');
    url = [];
    url.push('td');
    url.push(data.TD);
    url.push(data.orientation);
    url.push(terminalFilename);
    url = url.join('/');
    files.push(url);

    console.log('Generated terminal device URL is ' + url);

    /////////////////////////////////// 
    // WRIST CONNECTOR
    ///////////////////////////////////
    url = [];
    url.push('EbeArm');
    url.push('EbeArm_wrist_unit v1.stl');
    url = url.join('/');
    files.push(url);

    console.log('Generated wrist URL is ' + url);

    /////////////////////////////////// 
    // DOWNLOAD AND ARCHIVE
    ///////////////////////////////////
    var archivePath = path.join(tmp.dirSync({ prefix: 'limbforge-' }).name, 'limbforge.zip');
    var archiveFile = fs.createWriteStream(archivePath);

    var fiber = Fiber.current;

    var startTime = Date.now();
    s3Zip.archive({ region: 'us-east-1', bucket: 'limbforgestls' }, '', files)
      .pipe(archiveFile);
    archiveFile.on('close', function() {
      var elapsed = (Date.now() - startTime) / 1000;
      console.log('Files took ' + elapsed + 'seconds to download and zip.');
      fiber.run();
    });
    Fiber.yield();
    archiveFile.end();

    var fiber = Fiber.current;
    send(this.request, archivePath)
      .on('headers', (response) => {
        response.setHeader('Content-Disposition', 'attachment; filename=' + archiveFilename);
      })
      .on('end', (response) => {
        fiber.run();
      })
      .pipe(this.response)
    Fiber.yield();
    this.done();
  }
});

Meteor.methods({
  sendToFusion: function(data) {
    console.log('Sending data: ', data);
    HTTP.get('http://localhost:3100/api/submit', { params: { parameters: EJSON.stringify(data) } })
      // openurl('fusion360://command=open&file=/dev/null.f3d&privateInfo=' + JSON.stringify(data));
  }
});
