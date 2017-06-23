import { analytics } from "meteor/okgrow:analytics";

import Agent from '/imports/collections/agents.js';

import './index.html';

Meteor.setTimeout(() => {
  var agent_id = Session.get('agentId');
  Meteor.subscribe('palette', agent_id);
}, 2000);

Template.paletteLayout.helpers({
  agent() {
    var agent_id = Session.get('agentId');
    var agent = Agent.findOne(agent_id);
    return agent
  },

  status() {
    if (this._runningScript) return "Running a script";
    if (this.online) return "Online and idle";
    return "Not connected";
  }
});

Meteor.setTimeout(() => {
  var agent_id = Session.get('agentId');
  var agent = Agent.findOne(agent_id);
}, 4000);
