import { Class } from 'meteor/jagi:astronomy';
import { Enum } from 'meteor/jagi:astronomy';
import '/imports/fusionUtilities.js';
import namor from 'namor';

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
    status: {
      type: String,
      optional: true
    },
    lastSeen: {
      type: Date,
      optional: true
    },
    factory: {
      type: String,
      optional: true
    },
    foreman: {
      type: String,
      optional: true
    }
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
    events: {
      afterInsert: (e) => {
        // var id = e.currentTarget._id;
        // agents.set(id, new Agent(id)); // construct an Agent on the server
        // console.log('SERVER afterInsert agent ', e.currentTarget.name);

      },
      afterInit: (e) => {
        // a new Agents is always created by the Client, so 
        // console.log('SERVER afterInit agent ', e.currentTarget.name);
      }
    },
  });
}


if (Meteor.isFusion360) {
  Meteor.call("printLog", 'adding f360 agent helpers ');
  Agent.extend({
    events: {
      //     afterInsert: (e) => {
      //       Meteor.call("printLog", 'client saving agent to session ', e.currentTarget);
      //       Session.setPersistent('agent', e.currentTarget);
      //     },

      afterInit: (e) => {
        // a new Agents is always created by the Client, so 
        // e.currentTarget.startHeartbeat();
        // console.log('starting heartbeak for agent ', e);
        Meteor.call("printLog", 'client AfterInit for agent ', e.currentTarget.name);
      }
    },
    helpers: {
      heartbeat() {
        //       // var heartbeat = () => {
        //       //   this.lastSeen = new Date();
        //       //   this.save();
        //       //   Meteor.call("printLog", 'heartbeak for ', this.name);
        //       //   Meteor.setTimeout(heartbeat, 1000);
        //       // };
        //       // heartbeat();
        Meteor.call("printLog", 'heartbeak for ', this.name);
      }
    }
  });
  Meteor.call("printLog", 'done adding f360 agent helpers ');
}

export default Agent;

// there are additional Client-side methods for this class in the /imports/fusion360/index.js
