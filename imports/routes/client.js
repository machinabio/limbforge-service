import { Meteor } from "meteor/meteor";
import { Session } from 'meteor/session';

import humanInterval from 'human-interval';

import '/imports/ui/browser';
import '/imports/ui/fusion360';
import '/imports/startup/client.js';

import Agent from '/imports/collections/agents.js';

const timeout = humanInterval('2 seconds'); // seconds we retry fetching an agent ID

FlowRouter.route('/', {
  action: function(params) {
    if (Meteor.isFusion360) {
      window.location.replace(Meteor.absoluteUrl('fusion360', { replaceLocalhost: true }));
    };
    Meteor.call("printLog", "...connection on / route");
    BlazeLayout.render("App_body", { main: "webClientLayout" });
  }
});

FlowRouter.route('/fusion360', {
  action: function(params) {
    if (!Meteor.isFusion360) {
      window.location.replace(Meteor.absoluteUrl('', { replaceLocalhost: true }));
    };
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
  action: function(params) {
    if (!Meteor.isFusion360) {
      window.location.replace(Meteor.absoluteUrl('', { replaceLocalhost: true }));
    };
    Meteor.call("printLog", "...connection on /agent route");
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

