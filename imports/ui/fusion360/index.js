import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { EJSON } from 'meteor/ejson';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';

// import { analytics } from "meteor/okgrow:analytics";

import Agent from '/imports/collections/agents.js';
import Transaction from '/imports/collections/transactions.js';
import shift from '/imports/api/shift/client.js';
import Deathknell from '/imports/api/deathknell.js';

import './index.html';
Deathknell.initialize();

// Tracker.autorun(() => {
//   console.log('in tracker')
//   const xxx = Agent.findOne({});
//   if (xxx._runOnce) {
//     console.log('tracker autorun');
//     Meteor.call('printLog', 'tracker autorun');
//   }
// });

Template.fusionClientLayout.helpers({
  agent() {
    const agent = Agent.findOne({});
    agent.save();

    return agent;
  },

  runScript() {
    console.log('runScript helper');
    if (this._runOnce) {
      Meteor.call('printLog', 'Fusion360 Microserver received request');
      console.log('working...');
      var transaction = Transaction.findOne(this.transaction);
      if (!transaction) {
        Meteor.call(
          'printLog',
          'Fusion360 Microserver failed to lookup transaction: ' +
            this.transaction
        );
        return;
      }
      // Meteor.call("printLog", 'Fusion360 running transaction: ', transaction);
      // console.log('transaction: ', transaction);
      this._runOnce = false;
      this._runningScript = true;
      this.save();
      Deathknell.ring();
      // Using eval() doesn't allow the console debugger to display source or set breakpoints'
      // delete global.Shift;
      global.Shift = new shift(transaction ? transaction._id : null);
      transaction.start_time = new Date();

      // let script = this._script + '\nShift.done();';

      // Function(this._script).bind(this)();
      // console.log('running script ', script);
      let e = document.createElement('script');
      e.type = 'text/javascript';
      e.addEventListener('load', () => {
        e.remove();
      });

      e.src =
        'data:text/javascript;charset=utf-8,' +
        encodeURI(this._script + 'Shift.done()\n');
      document.head.appendChild(e);
      // console.log('script ran!');
      // transaction.finish_time = new Date();
      // transaction.response = EJSON.stringify(Shift.response);
      // transaction.save();
    }
  },
});
