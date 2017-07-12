import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

// import { analytics } from "meteor/okgrow:analytics";

import Agent from '/imports/collections/agents.js';

import './index.html';

console.log('Reading palette ui');

Template.paletteLayout.onCreated(() => {
  var agent_id = Session.get('agentId');
  var callbacks = {
    onReady() {
      console.log('subscription ONREADY');
    },
  }
  Meteor.subscribe('palette', agent_id, callbacks);
  console.log('subscribed to publication');
});

Template.paletteLayout.helpers({
  agent() {
    console.log('retreiving agent');
    var agent_id = Session.get('agentId');
    console.log('retreiving agent '+agent_id);
    var agent = Agent.findOne(agent_id);
    console.log('found agent ', agent);
    return agent
  },
  status() {
    if (this._runningScript) return "Running a script";
    if (this.online) return "Online and idle";
    return "Not connected";
  }
});

// Meteor.setTimeout(() => {

// }, 2000);

console.log('Done loading palette ui');
