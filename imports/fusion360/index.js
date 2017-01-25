import '/imports/fusionUtilities.js';

if (Meteor.isFusion360) {
  // Loading the Fusion API's on a web browsers causes errors.
  import '/imports/fusion360/api/';
}

import { Agent } from '/imports/api/agents.js';
import namor from 'namor';
import './index.html'

Session.setDefault('agent', '');

var agent;

Template.fusionClientLayout.onRendered(() => {
  try {
    var agent = Session.get('agent');
  } catch (e) {
    Meteor.call("printLog", "...Error retrieving agent from Session");
  }
  if (!agent) {
    agent = new Agent();
    agent.name = namor.generate({ words: 2, numbers: 3, manly: true });
    agent.lastSeen = new Date();
    agent.save((args) => {
      Meteor.call("printLog", "...Created new agent");
    });
  }
  debugger;
  // agent.startHeartbeat();
});

if (Meteor.isFusion360) {
  Meteor.call("printLog", 'adding f360 agent helpers ', e.currentTarget.name);
//   Agent.extend({
//     events: {
//       afterInsert: (e) => {
//         // Session.setPersistent('agent', agent);
//         Meteor.call("printLog", 'client saving agent to session ');
//       },

//       afterInit: (e) => {
//         // a new Agents is always created by the Client, so 
//         // e.currentTarget.startHeartbeat();
//         // console.log('starting heartbeak for agent ', e);
//         Meteor.call("printLog", 'client starting heartbeak for agent ', e.currentTarget.name);
//       }
//     },
//     helpers: {
//       startHeartbeat() {
//         // var heartbeat = () => {
//         //   this.lastSeen = new Date();
//         //   this.save();
//         //   Meteor.call("printLog", 'heartbeak for ', this.name);
//         //   Meteor.setTimeout(heartbeat, 1000);
//         // };
//         // heartbeat();
//       }
//     }
//   });
//   Meteor.call("printLog", 'done adding f360 agent helpers ');
}

// Template.fusionClientLayout.helpers({
//   agent() {
//   	return Agent.findOne(Session.get('agentId'));
//   }
// });

// var app = adsk.core.Application.get();
// var ui = app.userInterface;
// ui.messageBox('Emdedded Fusion360 microserver started.');
