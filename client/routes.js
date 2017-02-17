import { CadMake } from '/imports/cadmake.js';
import '/imports/browser';
import '/imports/fusion360';
import '/imports/demo';
import '/imports/startup.js';
import Agent from '/imports/api/agents.js';
import { Session } from 'meteor/session'

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


// FlowRouter.route('/cadmade/:scriptID', {
//   action: function(params, queryParams) {
//     var script = CadMake.findOne(params.scriptID).script;
//     Meteor.call('printLog', '...loading tenent: ' + params.scriptID);
//     Meteor.call('printLog', '...parameters: ', )
//     new Function(script)();
//   }
// });


// FlowRouter.route('/legacy', {
//   action: function(params) {
//     Meteor.call("printLog", "...connection on /legacy route");
//     if (Meteor.isFusion360) {
//       window.location.replace(Meteor.absoluteUrl('fusion360', { replaceLocalhost: true }));
//     };
//     BlazeLayout.render("App_body", { main: "webClientLayout" });
//   }
// });

// FlowRouter.route('/scripting', {
//   action: function(params) {
//     Meteor.call("printLog", "...connection on /scripting route");
//     if (Meteor.isFusion360) {
//       window.location.replace(Meteor.absoluteUrl('fusion360', { replaceLocalhost: true }));
//     };
//     BlazeLayout.render("App_body", { main: "scriptingLayout" });
//   }
// });

// FlowRouter.route('/demo', {
//   action: function(params) {
//     Meteor.call("printLog", "...connection on /demo route");
//     if (Meteor.isFusion360) {
//       window.location.replace(Meteor.absoluteUrl('fusion360', { replaceLocalhost: true }));
//     };
//     BlazeLayout.render("App_body", { main: "demoLayout" });
//   }
// });
