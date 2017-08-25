import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { EJSON } from 'meteor/ejson';

// import { analytics } from 'meteor/okgrow:analytics';

import Agent from '/imports/collections/agents.js';
import Transaction from '/imports/collections/transactions.js';
import Deathknell from '/imports/api/deathknell.js';

export default (Shift = class Shift {
  constructor(transaction_id) {
    if (transaction_id) {
      this._transaction_doc = Transaction.findOne(transaction_id);
      this.transaction = this._transaction_doc._id;
      this.data = this._transaction_doc.data;
    }
    this.response = {};
    // console.log('Processing transaction: ', this);
  }

  cache(stlBuffer, path) {
    // analytics.track('shift.cache', { path: path, size: stlBuffer.length });
    // console.log('stl : ', TextDecoder.decode(stlBuffer));
    Meteor.call('shift.cache', stlBuffer, path);
  }

  sleep(ms) {
    const start = new Date().getTime();
    const expire = start + ms;
    while (new Date().getTime() < expire) {}
    return;
  }

  done() {
    this._transaction_doc.finish_time = new Date();
    this._transaction_doc.response = EJSON.stringify(this.response);
    this._transaction_doc.save();
    Deathknell.finish();
  }
});
