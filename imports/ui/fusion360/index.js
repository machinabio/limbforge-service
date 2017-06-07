import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { EJSON } from 'meteor/ejson';

import text_encoding from 'text-encoding';

import { analytics } from "meteor/okgrow:analytics";

import Agent from '/imports/collections/agents.js';
import Transaction from '/imports/collections/transactions.js';;
import shift from '/imports/api/shift/client.js';

import './index.html';

global.TextDecoder = new text_encoding.TextDecoder();
global.TextEncoder = new text_encoding.TextEncoder();

if (Meteor.isFusion360) {
  // Loading the Fusion API's on a web browsers causes errors.
  import '/imports/api/fusion360js/';
  Meteor.subscribe('fusion', adsk.core.Application.get().userId);
  Meteor.call("printLog", 'Fusion360 agent capabilities:', navigator.userAgent);
};

Template.fusionClientLayout.helpers({
  agent() {
    var agent = Agent.findOne(Session.get('agentId'));
    if (!agent) return;
    agent.online = true;
    agent.save();
    return agent
  },

  runScript() {
    if (this._runOnce) {
      // Meteor.call("printLog", 'Fusion360 looking up transaction: ', this.transaction);
      var transaction = Transaction.findOne(this.transaction);
      if (!transaction) return;
      // Meteor.call("printLog", 'Fusion360 running transaction: ', transaction);
      // console.log('transaction: ', transaction);
      this._runOnce = false;
      this._runningScript = true;
      this.save();
      // Using eval() doesn't allow the console debugger to display source or set breakpoints'
      delete global.Shift;
      global.Shift = new shift(transaction ? transaction._id : null)
      transaction.start_time = new Date();

      // let script = this._script + '\nShift.done();';

      // Function(this._script).bind(this)();
      // console.log('running script ', script);
      let e = document.createElement('script');
      e.type = 'text/javascript';
      e.addEventListener("load", () => {
        // console.log('in script loaded callback');
        e.remove();
        transaction.finish_time = new Date();
        transaction.response = EJSON.stringify(Shift.response);
        transaction.save();
      });
      e.src = 'data:text/javascript;charset=utf-8,' + encodeURI(this._script);
      document.head.appendChild(e);
      // console.log('script ran!');
      // transaction.finish_time = new Date();
      // transaction.response = EJSON.stringify(Shift.response);
      // transaction.save();
    }
  }
});
