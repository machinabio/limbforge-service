import Agent from '/imports/api/agents.js';
import namor from 'namor';
import { Accounts } from 'meteor/accounts-base'
import mixpanel from 'mixpanel';
import 'meteor/yogiben:mixpanel';
import { EJSON } from 'meteor/ejson';


let Api = new Restivus({
  prettyJson: true
});

/**
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
      console.log('creating agent id '+agent._id);
      console.log('creating agent name '+agent.name);

      this.response.write(EJSON.stringify({ agentId: agent._id }));
      this.done();
    });
  }
});
