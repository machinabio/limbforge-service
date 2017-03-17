import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { EJSON } from 'meteor/ejson';

import Archiver from 'archiver';
import Fiber from 'fibers';
import Future from 'fibers/future';
import fs from 'fs';
import tmp from 'tmp';
import s3Zip from 's3-zip';
import path from 'path';
import knox from 'knox';
import opn from 'opn';
import toBuffer from 'typedarray-to-buffer';

import { analytics } from "meteor/okgrow:analytics";

import Agent from '/imports/api/agents.js';
import Params from '/imports/parameters.js';
import Transaction from '/imports/models/transaction.js';
import text_encoding from 'text-encoding';

global.TextDecoder = new text_encoding.TextDecoder();
global.TextEncoder = new text_encoding.TextEncoder();

const settings = Meteor.settings.storage;

var storage_client = knox.createClient({
  key: settings.accessKeyId,
  secret: settings.secretAccessKey,
  bucket: settings.bucket
});

Meteor.methods({
  'shift.cache' (stl, path) {
    this.unblock();
    console.log('METHOD shift.cache to path ',path );
    future = new Future();
    console.log('...with buffer', TextDecoder.decode(stl).slice(0,100));
    var stl_buffer = toBuffer(stl);
    storage_client.putBuffer(stl_buffer, path, {'Content-Type': 'application/vnd.ms-pkistl'}, ()=>{
      future.return();
    });
    future.wait();
  }
})


/*

Loading Threejs geometery from a ArrayBuffer in JS 
http://n-e-r-v-o-u-s.com/blog/?p=2738



*/