import { Meteor } from "meteor/meteor";
import { Session } from 'meteor/session';
import logger from '/imports/api/logger.js';

import humanInterval from 'human-interval';

import '/imports/startup/client.js';

const timeout = humanInterval('2 seconds'); // seconds we retry fetching an agent ID

FlowRouter.route('/', {
  action(params) {
    if (Meteor.isFusion360) {
      window.location.replace(Meteor.absoluteUrl('fusion360', { replaceLocalhost: true }));
    };
    import '/imports/ui/browser';
    Meteor.call("printLog", "...connection on / route");
    BlazeLayout.render("App_body", { main: "webClientLayout" });
  }
});

FlowRouter.route('/palette/:agent_id', {
  action(params) {
    if (!Meteor.isFusion360) {
      window.location.replace(Meteor.absoluteUrl('', { replaceLocalhost: true }));
    };
    const agent_id = params.agent_id;
    // TODO logger not available on client? verify
    // logger.info(`palette for agent ${agent_id}`); 
    console.log(`palette for agent ${agent_id}`);
    Meteor.call("printLog", "...connection on /palette route from agent id "+agent_id);
    Session.setPersistent('agentId', agent_id);
    import '/imports/ui/palette';
    BlazeLayout.render("App_body", { main: "paletteLayout" });
  }
});

FlowRouter.route('/fusion360', {
  action(params) {
    if (!Meteor.isFusion360) {
      window.location.replace(Meteor.absoluteUrl('', { replaceLocalhost: true }));
    };
    import Agent from '/imports/collections/agents.js';
    import '/imports/api/fusion360js';
    import '/imports/ui/fusion360';
    Meteor.call("printLog", "...connection on /fusion360 route");
    let queryParams = {
      adskEmail: adsk.core.Application.get().userName,
      adskId: adsk.core.Application.get().userId
    }
    // console.log('setting retry timeout for agent id');
    // let retry_handle = Meteor.setTimeout(window.location.reload, timeout)
    HTTP.get('/api/retrieveId', { params: queryParams }, (err, res) => {
      // Meteor.clearTimeout(retry_handle);
      Agent.initialize(res.data.agentId);
    });
    BlazeLayout.render("App_body", { main: "fusionClientLayout" });
  }
});

FlowRouter.route('/agent', {
  action(params) {
    if (!Meteor.isFusion360) {
      window.location.replace(Meteor.absoluteUrl('', { replaceLocalhost: true }));
    };
    Meteor.call("printLog", "...connection on /agent route");
    import '/imports/api/fusion360js';
    import '/imports/ui/fusion360';
    import Agent from '/imports/collections/agents.js';
    let queryParams = {
      adskEmail: adsk.core.Application.get().userName,
      adskId: adsk.core.Application.get().userId
    }
    HTTP.get('/api/retrieveAgent', { params: queryParams }, (err, res) => {
      Agent.initialize(res.data.agentId);
    });
    BlazeLayout.render("App_body", { main: "fusionClientLayout" });
  }
});


