import { Meteor } from "meteor/meteor";
import { Session } from 'meteor/session';
import { Random } from 'meteor/random';

import namor from 'namor';
import opn from 'opn';

import { Class } from 'meteor/jagi:astronomy';
import { Enum } from 'meteor/jagi:astronomy';

import '/imports/fusionUtilities.js';

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
    transaction: {
      type: String,
      optional: true
    },
    _script: {
      type: String,
      optional: true
    },
    _runningScript: {
      type: Boolean,
      optional: true,
      default: false
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

  Meteor.methods({
    spawn_agent() {
      var agent_count = Agent.find({ foreman: Meteor.settings.shift.foreman.name, remote: true }).fetch().length;

      if (agent_count >= Meteor.settings.shift.foreman.maxWorkers) {
        console.log('Too many agents!');
        return false;
      } else {
        console.log('Spawn a new agent (TODO)');
        return true;
      }
    }
  });
}

if (Meteor.isClient) {
  Agent.getLocal = function getLocal() {
    return Agent.findOne({ online: true, remote: false });
  };
  Agent.getCloud = function getCloud() {
    var ret = Agent.find({ remote: true });
    return ret;
  };
}

if (Meteor.isFusion360) {
  Agent.initialize = function initialize(id) {
    Tracker.autorun((c) => {
      let agent = Agent.findOne(id);
      if (agent) {
        console.log('found an agent! ', agent);
        c.stop();
        Meteor.defer(agent.initialize.bind(agent));
      }
    });
  };

  Agent.extend({
    events: {},
    helpers: {
      initialize() {
        // console.log('initializing agent ' + this);
        Session.set('agentId', this._id);
        let cursor = Agent.find(this._id, { fields: { ping: true } })
        console.log('cursor ',cursor.fetch());
        // cursor.observeChanges({changed: console.log('called watchdog')});
        cursor.observeChanges({
          changed: () => {
            // console.log('called watchdog agent id ' + this._id);
            let agent = Agent.findOne(this._id);
            agent.lastSeen = new Date();
            agent.save();
          }
        });
      }
    }
  });
}

Agent.spawn = function spawn() {
  Meteor.call('spawn_agent');
};

export default Agent;
