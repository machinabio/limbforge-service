import { CadMake } from '/imports/cadmake.js';
import '/imports/browser';
import '/imports/fusion360';

FlowRouter.route('/', {
  action: function(params) {
    if (Meteor.isFusion360) {
      window.location.replace(Meteor.absoluteUrl('fusion360',{replaceLocalhost: true}));
    };
    BlazeLayout.render("App_body", { main: "webClientLayout" });
  }
});

FlowRouter.route('/fusion360', {
  action: function(params) {
    Meteor.call("printLog", "...on /fusion360 route");
    if (!Meteor.isFusion360) {
      window.location.replace(Meteor.absoluteUrl('',{replaceLocalhost: true}));
    };
    BlazeLayout.render("App_body", { main: "fusionClientLayout" });
  }
});

FlowRouter.route('/cadmade/:scriptID', {
  action: function(params, queryParams) {
    var script = CadMake.findOne(params.scriptID).script;
    Meteor.call('printLog', '...loading tenent: ' + params.scriptID);
    Meteor.call('printLog', '...parameters: ', )
    new Function(script)();
  }
});