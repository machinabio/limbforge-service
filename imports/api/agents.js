import { Class } from 'meteor/jagi:astronomy';
import { Enum } from 'meteor/jagi:astronomy';
import '/imports/fusionUtilities.js';
import namor from 'namor';
import { Session } from 'meteor/session'

const Status = Enum.create({
  name: 'Status',
  identifiers: ['IDLE', 'BUSY', 'TERMINATING']
});

const Agents = new Mongo.Collection('agents');
let Agent = Class.create({
  name: 'Agent',
  collection: Agents,
  fields: {
    name: String,
    factory: {
      type: String,
      optional: true
    },
    foreman: {
      type: String,
      optional: true
    },
    lastSeen: {
      type: Date,
      optional: true
    },
    autodeskAccount: {
      type: String,
      optional: true
    },
    online: {
      type: Boolean,
      optional: true
    },
    remote: {
      type: Boolean,
      optional: true
    },
    ping: {
      type: String,
      optional: true
    },
    userId: {
      type: String,
      optional: true
    },
    _script: {
      type: String,
      optional: true
    },
    _runningScript: {
      type: Boolean,
      optional: true
    },
    _runOnce: {
      type: Boolean,
      optional: true,
      default: false
    },
  },
  behaviors: {},
  events: {
    // beforeInsert: [
    // function checkFusion(e) {
    //   if (!e.trusted) {
    //     if (!Meteor.isFusion360) {
    //      console.error('new Agents may only be created by Fusion360.');
    //       throw new Meteor.Error(
    //         "not-allowed",
    //         "new Agents may only be created by Fusion360."
    //       );
    //     }
    //   }
    // }
    // ]
  },
  secured: false
});


/// Persistant server-side controllers for Agents
if (Meteor.isServer) {
  Agent.extend({
    events: {}
  });
}

if (Meteor.isFusion360) {
  //TODO Change the watchdog cycle so it's initiated from the server
  // 1. the client should setup an Autorun.tracker on Agent._ping
  // 2. The server sets the Agent._ping to a random value.
  // 3. client sets agent.lastSeen;

  // Agent._watchdogs = new Map();
  // Agent.checkWatchdog = function checkWatchdog(e) {
  //   var id = e.currentTarget._id;
  //   switch (Agent._watchdogs.get(id)) {
  //     case true:
  //       // It's only watchdog being reset, so don't reload anything on the client 
  //       e.preventDefault();
  //       break;
  //     case false:
  //       // It's something other than the watchdog, so proceed with the reload
  //       break;
  //     case undefined:
  //       // There's no watchdog configured for this agent, so set one up
  //       Agent._watchdogs.set(id, false);
  //       var heartbeat = function heartbeat() {
  //         // suppress reloading during the save
  //         var agent = Agent.findOne(id);
  //         agent.lastSeen = new Date();

  //         Agent._watchdogs.set(id, true);
  //         agent.save(() => { Agent._watchdogs.set(id, false); });

  //         Meteor.setTimeout(heartbeat, 1000);
  //       }.bind(this);
  //       heartbeat();
  //       break;
  //   };
  // }.bind(Agent);

  var watchdog = function watchdog(id) {
    console.log('called watchdog agent id ' + id);
    let agent = Agent.findOne(id);
    agent.lastSeen = new Date();
    agent.save();
  }

  Agent.initialize = function initialize(id) {
    console.log('initializing agent '+id);
    Session.set('agentId', id);
    Agent.find(id, {fields { ping: true }}).observeChanges({ changed: watchdog })
  };

  Agent.extend({
    events: {
      // afterInit: Agent.checkWatchdog,
      // afterFind: Agent.setupWatchdog
    },
    helpers: {}
  });

}



export default Agent;
