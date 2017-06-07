import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import { check } from 'meteor/check';
import { Random } from 'meteor/random'

import Request from 'request';
import Archiver from 'archiver';
import Fiber from 'fibers';
import fs from 'fs';
import tmp from 'tmp';
import s3Zip from 's3-zip';
import path from 'path';
import AWS from 'aws-sdk';

import { analytics } from "meteor/okgrow:analytics";

import Agent from '/imports/collections/agents.js';
import Script from '/imports/collections/scripts.js';
import Transaction from '/imports/collections/transactions.js';;

import '/imports/startup/server.js';
import '/imports/api/agent-factory.js';
import '/imports/api/job-queue.js';

import '/imports/api/shift/server.js';

import humanInterval from 'human-interval';

const job_timeout = humanInterval(`45 seconds`);

//Restivus is a global. See https://github.com/kahmali/meteor-restivus
let Api = new Restivus({
  prettyJson: true
});

Api.addRoute('rex/:hash', {
  post: function() {
    const id = Random.id(4);
    console.log(`-- Transaction ${id}: Receieved POST at /rex/${this.urlParams.hash}`);
    //TODO add logging to analytics
    const script = Script.findOne({ _md5: this.urlParams.hash, published: true });
    if (script) {
      const data = this.bodyParams ? this.bodyParams : {};
      // console.log('rex data:', data);
      const params = {
        script_id: script._id,
        data: data
      }
      this.response.setHeader('Content-Type', 'application/vnd.ms-pkistl');
      const transaction_id = Meteor.call('rex_enqueue', params);
      const fiber = Fiber.current;
      const query_handle = Transaction.find(transaction_id, { fields: { response: true } })
        .observeChanges({
          changed: () => {
            console.log(`-- Transaction ${id}: observed change in response`);
            // console.log(transaction_id);
            const transaction = Transaction.findOne(transaction_id);
            // console.log(transaction);
            this.response.write(transaction.response);
            fiber.run();
          }
        });
      const watchog_handle = Meteor.setTimeout(() => {
        console.log(`-- Transaction ${id}: no response from Fusion360 agent before timeout`);
        query_handle.stop();
      }, job_timeout);
      Fiber.yield();
      Meteor.clearTimeout(watchog_handle);
      query_handle.stop();
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
