import { CadMake } from '/imports/cadmake.js';

FlowRouter.route('/', {
  action: function(params) {
    BlazeLayout.render("App_body", { main: "webClientLayout" });
  }
});

FlowRouter.route('/cadmade/:scriptID', {
  action: function(params, queryParams) {
    // Tracker.autorun(function() {
      var script = CadMake.findOne(params.scriptID).script;
      Meteor.call('printLog', '...loading tenent: ' + params.scriptID);
      Meteor.call('printLog', '...parameters: ', )
      new Function(script)();
      // adsk.terminate();
    // });
  }
});
