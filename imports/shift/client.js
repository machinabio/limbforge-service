import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { EJSON } from 'meteor/ejson';

import { analytics } from "meteor/okgrow:analytics";

import Agent from '/imports/api/agents.js';
import Params from '/imports/parameters.js';
import Transaction from '/imports/models/transaction.js';

export default Shift = class Shift {
  constructor(transaction_id) {
    if (transaction_id) {
      this._transaction_doc = Transaction.findOne(transaction_id);
      this.transaction = this._transaction_doc._id;
      this.data = this._transaction_doc.data;
    }
    
    this.response = {};
    console.log('Transaction: ', this);
  }

  cache(stlBuffer, path) {
    analytics.track('shift.cache', { path: path, size: stlBuffer.length });
    console.log('stl : ', TextDecoder.decode(stlBuffer));
    Meteor.call('shift.cache', stlBuffer, path);
  }

  log(arg) {
    console.log(arg);
  }
};
