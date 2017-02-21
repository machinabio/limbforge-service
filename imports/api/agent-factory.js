import Agent from '/imports/api/agents.js';
import namor from 'namor';
import { Accounts } from 'meteor/accounts-base'
import mixpanel from 'mixpanel';
import 'meteor/yogiben:mixpanel';
import { EJSON } from 'meteor/ejson';
import Transaction from '/imports/models/transaction.js';
import { Random } from 'meteor/random';
import humanInterval from 'human-interval';
import Queue from '/imports/api/job-queue.js';

const purgeLimit = humanInterval('5 minutes'); // seconds until an agent is considered "dead" and purged
const agentWatchdogTick = humanInterval('1 seconds'); // check each active agent's status every 2 seconds 
const agentTimeout = humanInterval('2.5 seconds'); // 5 seconds until an agent is considered "offline"

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
    var adskEmail = this.queryParams.adskEmail;
    var adskId = this.queryParams.adskId;

    //TODO save the adskId to the User record so we can use that to lookup records

    console.log('local agent log in for user ', adskEmail);

    //TODO Figure out how to get mixpanel working on the server
    // mixpanel('worker.checkin', { autodeskAccount: this.urlParams.adskEmail, ip: this.request.headers.host });
    // mixpanel.track('worker.checkin');

    this.response.writeHead(200, 'retrieving id', {
      'Content-Type': 'application/json'
    });

    var agent = Agent.findOne({ autodeskAccount: adskEmail });
    if (!agent) {
      // mixpanel('worker.new', { autodeskAccount: adskEmail, ip: this.request.headers.host });
      // mixpanel.track('worker.new');
      agent = new Agent();
      agent.name = namor.generate({ words: 3, numbers: 4, manly: true });
      agent.autodeskAccount = adskEmail;
    }
    try {
      console.log('looking up account by email ' + agent.autodeskAccount);
      agent.userId = Accounts.findUserByEmail(agent.autodeskAccount)._id;
    } catch (e) {
      console.error('failed to find a matching autodeskAccount');
    }
    agent.remote = false;
    agent.foreman = Meteor.settings.shift.foreman.name;
    agent.save(() => {
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
    var adskEmail = this.queryParams.adskEmail;
    console.log('cloud agent log in for user ', adskEmail);
    this.response.writeHead(200, 'retrieving id', {
      'Content-Type': 'application/json'
    });
    var agent = new Agent();
    agent.autodeskAccount = adskEmail;
    agent.remote = true;
    agent.name = namor.generate({ words: 3, numbers: 4, manly: true });
    agent.lastSeen = new Date();
    try {
      console.log('looking up account by email ' + agent.autodeskAccount);
      agent.userId = Accounts.findUserByEmail(agent.autodeskAccount)._id;
    } catch (e) {
      console.error('failed to find a matching autodeskAccount');
    }
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
Tasks
*/

Queue.processEvery('0.5 second');

Queue.define(
  'check_agents', 
  { lockLifetime:  500},
  Meteor.bindEnvironment((job, done) => {
    agents = Agent.find({}).fetch();
    console.log('checking watchdogs for ' + agents.length + ' agents');
    agents.forEach((agent) => {
      // console.log('...scheduling watchdog check: ', agent);
      Queue.now('check_agent', agent._id);
    });
  }));

Queue.define('check_agent', Meteor.bindEnvironment((job, done) => {
  console.log("Watchdog : ", job.attrs.data);
  let agent = Agent.findOne(job.attrs.data);
  let sinceLastSighting = new Date() - agent.lastSeen;

  console.log("Watchdog : " + agent._id);
  console.log("...last seen at " + agent.lastSeen);
  console.log('...' + sinceLastSighting + " ms ago");

  if (sinceLastSighting > purgeLimit) {
    agent.remove();
    return;
  }

  if (sinceLastSighting > agentTimeout) {
    agent.online = false;
    agent.save();
    return;
  }

  agent.ping = Random.id();
  agent.save();
}));

Queue.create('check_agents', {})
  .unique({})
  .repeatEvery(agentWatchdogTick)
  .save();
