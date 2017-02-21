import { Class } from 'meteor/jagi:astronomy';
import { Enum } from 'meteor/jagi:astronomy';
import '/imports/fusionUtilities.js';
import namor from 'namor';
import { Session } from 'meteor/session';
import { Random } from 'meteor/random';

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
  let watchdog = function watchdog(id) {
    console.log('called watchdog agent id ' + id);
    let agent = Agent.findOne(id);
    agent.lastSeen = new Date();
    agent.save();
  }

  Agent.initialize = function initialize(id) {
    console.log('initializing agent ' + id);
    Session.set('agentId', id);
    Agent.find(id, { fields: { ping: true } }).observeChanges({ changed: watchdog })
  };

  Agent.extend({
    events: {},
    helpers: {}
  });
}

export default Agent;
