import Agent from '/imports/api/agents.js';
import Params from '/imports/parameters.js';
import namor from 'namor';
import Transaction from '/imports/models/transaction.js';
import './index.html'
import { check } from 'meteor/check'
import { EJSON } from 'meteor/ejson';

if (Meteor.isFusion360) {
  // Loading the Fusion API's on a web browsers causes errors.
  import '/imports/fusion360/api/';
  Meteor.subscribe('fusion', adsk.core.Application.get().userName);
};

Template.fusionClientLayout.helpers({
  agent() {
    var agent = Agent.findOne(Session.get('agentId'));
    if (!agent) return;
    if (agent._runningScript) {
      agent._runningScript = false;
    }
    agent.online = true;
    agent.save();
    return agent
  },

  runScript() {
    if (this._runOnce) {
      Meteor.call("printLog", 'Fusion360 looking up transaction: ', this.transaction);
      var transaction = Transaction.findOne(this.transaction);
      if (!transaction) return;
      Meteor.call("printLog", 'Fusion360 running transaction: ', transaction);
      console.log('transaction: ', transaction);

      this._runOnce = false;
      this._runningScript = true;
      this.save();
      // Using eval() doesn't allow the console debugger to display source or set breakpoints'
      global.Shift = {};
      Shift.transaction = transaction ? transaction._id : null;
      Shift.data = transaction ? transaction.data : null;
      Shift.response = {};
      transaction.start_time = new Date();
      // Function(this._script).bind(this)();
      Function(this._script)();
      // var e = document.createElement('script');
      // e.type = 'text/javascript';
      // e.src = 'data:text/javascript;charset=utf-8,' + encodeURI(this._script);
      // document.head.appendChild(e);
      // e.remove();
      // save the Shift.response property to the transaction. Meteor.call?
      transaction.finish_time = new Date();
      transaction.response = EJSON.stringify(Shift.response);
      console.log("response ", transaction.response)
      transaction.save();
    }
  }
});

Template.parameters_fusion.helpers({
  get_params() {
    return Params.find({});
  },
  update() {
    console.log('updating parameter ' + this.name);
    var params = adsk.core.Application.get().activeDocument.design.allParameters;
    params.itemByName(this.name).value = this.value;
  }
});
