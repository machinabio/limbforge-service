import Agent from '/imports/api/agents.js';
import Params from '/imports/parameters.js';
import namor from 'namor';
import './index.html'

if (Meteor.isFusion360) {
  // Loading the Fusion API's on a web browsers causes errors.
  import '/imports/fusion360/api/';
  Meteor.subscribe('fusion', adsk.core.Application.get().userName);
};

Template.fusionClientLayout.helpers({
  agent() {
    var agent = Agent.findOne(Session.get('agentId'));
    if (agent._runningScript) {
      agent._runningScript = false;
    }
    agent.online = true;
    agent.save();
    return agent
  },

  runScript() {
    if (this._runOnce) {
      this._runOnce = false;
      this._runningScript = true;
      this.save();
      Meteor.call("printLog", 'running script ', this._script);

      // Using eval() doesn't allow the console debugger to display source or set breakpoints
      var e = document.createElement('script');
      e.type = 'text/javascript';
      e.src = 'data:text/javascript;charset=utf-8,' + encodeURI(this._script);
      document.head.appendChild(e);
      e.remove();

      this._runningScript = false;
      this.save();
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
