import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base'
import { EJSON } from 'meteor/ejson';
import { Random } from 'meteor/random';

import namor from 'namor';
import humanInterval from 'human-interval';

import { analytics } from "meteor/okgrow:analytics";

import Agent from '/imports/api/agents.js';
import Transaction from '/imports/models/transaction.js';
import Queue from '/imports/api/job-queue.js';
import Script from '/imports/api/scripts.js';

const purgeLimit = humanInterval('30 seconds'); // seconds until an agent is considered "dead" and purged
const agentWatchdogTick = humanInterval('3 seconds'); // check each active agent's status every 2 seconds 
const agentTimeout = humanInterval('7 seconds'); // 5 seconds until an agent is considered "offline"

if (Meteor.isClient) throw Error('tried importing agent-factory.js on client');

let Api = new Restivus({
  prettyJson: true
});

/**
 *  Used by local agents reporting in to Fusion360.io webserver.
 *
 * @api {get} /api/retrieveId/:adskAccount Request Agent ID for user email
 * @apiName Retreive local ID
 * @apiGroup Agent
 *
 * @apiParam {Number} adskAccount Users Autodesk ID.
 *
 * @apiSuccess {String} agentId Agent ID.
 */
Api.addRoute('retrieveId', {
  get: function() {
    var adskEmail;
    var adskId = this.queryParams.adskId;

    // lookup account by adskId first
    var user = Accounts.users.findOne({ autodesk_id: adskId });
    if (user) {
      adskEmail = user.emails[0].address;
    } else {
      // lookup account by email
      user = Accounts.findUserByEmail(this.queryParams.adskEmail);
      Meteor.users.update(user._id, {
        $set: {
          autodesk_id: adskId
        }
      });
    };
    if (!user) throw new Meteor.Error('failed to find a matching autodeskAccount');
    console.log('cloud agent log in for user ', user.emails[0].address);

    this.response.writeHead(200, 'retrieving id', {
      'Content-Type': 'application/json'
    });

    var agent = Agent.findOne({ autodeskAccount: adskEmail });
    if (!agent) {
      //analytics.track('worker.new', { autodeskAccount: adskEmail, ip: this.request.headers.host });
      agent = new Agent();
      agent.name = namor.generate({ words: 3, numbers: 4, manly: true });
      agent.autodeskAccount = adskEmail;
      agent.user_id = user._id;
      agent.remote = false;
    }
    agent.lastSeen = new Date();

    agent.foreman = Meteor.settings.shift.foreman.name;

    agent.save(() => {
      console.log('creating agent id ' + agent._id);
      console.log('creating agent name ' + agent.name);

      this.response.write(EJSON.stringify({ agentId: agent._id }));
      this.done();
    });
  }
});



/**
 *  Used by cloud agents reporting in to their Foreman.
 *
 * @api {get} /api/retrieveId/:adskAccount Request cloud Agent ID for user email
 * @apiName Retreive cloud ID
 * @apiGroup Agent
 *
 * @apiParam {Number} adskAccount Users Autodesk ID.
 *
 * @apiSuccess {String} agentId Agent ID.
 */
Api.addRoute('retrieveAgent', {
  get: function() {
    var adskEmail;
    var adskId = this.queryParams.adskId;

    // lookup account by adskId first
    var user = Accounts.users.findOne({ autodesk_id: adskId });
    if (user) {
      adskEmail = user.emails[0].address;
    } else {
      // lookup account by email
      user = Accounts.findUserByEmail(this.queryParams.adskEmail);
      Meteor.users.update(user._id, {
        $set: {
          autodesk_id: adskId
        }
      });
    };
    if (!user) throw new Meteor.Error('failed to find a matching autodeskAccount');
    console.log('cloud agent log in for user ', adskEmail);

    this.response.writeHead(200, 'retrieving id', {
      'Content-Type': 'application/json'
    });

    var agent = new Agent();
    agent.autodeskAccount = adskEmail;
    agent.user_id = user._id;
    agent.remote = true;
    agent.name = namor.generate({ words: 3, numbers: 4, manly: true });
    agent.lastSeen = new Date();

    agent.foreman = Meteor.settings.shift.foreman.name;
    agent.save(() => {
      console.log('creating agent id ' + agent._id);
      console.log('creating agent name ' + agent.name);

      this.response.write(EJSON.stringify({ agentId: agent._id }));
      this.done();
    });
  }
});

Queue.processEvery('0.5 second');
Queue.define(
  'agent_check_all', { lockLifetime: 500 },
  Meteor.bindEnvironment((job, done) => {
    agents = Agent.find({}).fetch();
    console.log('checking watchdogs for ' + agents.length + ' agents');
    agents.forEach((agent) => {
      Queue.create('agent_check', agent._id)
        .unique({ id: agent._id })
        .schedule('now')
        .save();
    });
  }));

Queue.define(
  'agent_check',
  Meteor.bindEnvironment((job, done) => {
    let agent = Agent.findOne(job.attrs.data);
    let sinceLastSighting = new Date() - agent.lastSeen;

    // console.log("Watchdog : " + agent._id);
    // console.log("...last seen at " + agent.lastSeen);
    // console.log('...' + sinceLastSighting + " ms ago");

    if (sinceLastSighting > purgeLimit) {
      agent.remove();
      job.remove();
      return;
    }

    agent.ping = Random.id();
    if (sinceLastSighting > agentTimeout) {
      agent.online = false;
    }
    agent.save();

    return;
  })
);

/**
@params data      Object - this is passed to the script being run, accessed via `Shift.data.*`
@params script_id String - The ID of the script to execute
@params agent_id  String - (optional) The requested agent
*/
Meteor.methods({
  rex_enqueue(params) {
    if (!this.userId) {
      console.warn('API REX call with no logged in user');

      // throw Meteor.Error('User must be logged in to call "rex_enqueue"')
    }

    // console.log('MeteorMethod rex_enqueue', params);
    let transaction = new Transaction();
    transaction.data = params.data;
    transaction.script_id = params.script_id;
    transaction.user_id = this.userId || Script.findOne(transaction.script_id).userId;
    transaction.agent_id = params.agent_id;
    transaction.save();
    // console.log('MeteorMethod rex_enqueue transaction', transaction);
    Queue.now('script_rex', transaction._id);
    return transaction._id;
  }
});

Queue.define(
  'script_rex',
  Meteor.bindEnvironment((job, done) => {
    var transaction = Transaction.findOne(job.attrs.data);
    var agent;
    // console.log('Agenda scriptRex transaction:', transaction);
    if (transaction.agent_id) {
      agent = Agent.findOne(transaction.agent_id);
    } else {
      var agents = Agent.find({ foreman: Meteor.settings.shift.foreman.name, remote: true, online: true, _runningScript: false }).fetch();

      if (agents.length == 0) {
        console.log('No free agents, rescheduling in 1 s');
        job.schedule('in 1 second');
        job.save();
        return
      }
      agent = agents[Math.floor(Math.random() * agents.length)];
      transaction.agent_id = agent._id;
    }
    let script = Script.findOne(transaction.script_id);
    let data = transaction.data;

    transaction.queued_time = new Date();
    transaction.save();
    agent.transaction = transaction._id;
    agent._script = script.code;
    agent._runOnce = true;
    // console.log('Agenda scriptRex transaction:', transaction);

    agent.save();
    job.remove();
  })
);

Queue.create('agent_check_all', {})
  .unique({})
  .repeatEvery(agentWatchdogTick)
  .save();
