import { Meteor } from "meteor/meteor";
import { Session } from 'meteor/session';

import '/imports/browser';
import '/imports/fusion360';
import '/imports/demo';
import '/imports/startup.js';

import Agent from '/imports/api/agents.js';

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
    HTTP.get('/api/retrieveId', { params: queryParams }, (err, res) => {
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

