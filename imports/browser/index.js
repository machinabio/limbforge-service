import { Template } from 'meteor/templating';
import { Messages } from '/imports/messages.js';
import { EJSON } from 'meteor/ejson';
import { Dashboard } from '/imports/dashboard.js';
import { CadMake } from '/imports/cadmake.js';
import Agent from '/imports/api/agents.js';
import Script from '/imports/api/scripts.js';
import './index.html';
import moment from 'moment';
import Params from '/imports/parameters.js';

import md5 from 'md5';

Session.setDefault('activeTab', 'scripting');

Template.webClientLayout.onRendered(() => {
  Tracker.autorun(() => {
    BlazeLayout.render("webClientLayout", {
      body: Session.get('activeTab')
    });
  });
});

// Template.topbar.onRendered(() => {
//   this.$('#topbar').pushpin();
// });

// Template.topbar.onCreated(() => {
//   this.pushpin();
// });

Template.scriptList.helpers({
  scripts() {
    return Script.find({});
  },
  active() {
    return this._id == Session.get('activeScript') ? "active" : "";
  }
});

Template.scriptList.events({
  'click .collection-item' (event) {
    Session.set('activeScript', this._id);
  },
  'click #newScript' (event) {
    mixpanel.track('script.new');
    var script = new Script();
    script.name = 'new script';
    script.userId = Meteor.userId();
    script.save(() => {
      Session.set('activeScript', script._id);
    });
  }
})

Template.code.events({
  'click #runScript' (event) {
    var agent = Agent.findOne({remote: false});
    if (!agent) {
      console.error('No local agent found for autodesk ID ' + Meteor.user().emails[0].address);
      return;
    }
    agent._script = Session.get('scriptBody');
    agent._runOnce = true;
    mixpanel.track('script.execute');
    agent.save();
  }
})

Template.code.helpers({
  activeScript() {
    $('.collapsible').collapsible();
    var script = Script.findOne(Session.get('activeScript'));
    Session.set('scriptBody', script.code);
    Session.set('cloud_params', script.parameters);
    Tracker.autorun(() => {
      script.code = Session.get('scriptBody');
      script.parameters = Session.get('cloud_params');
      script.save();
    });
    return script;
  },
  codeEditorOptions() {
    return {
      lineNumbers: true,
      mode: "javascript",
      autofocus: true
    }
  }
});

Template.code.onRendered(() => {
  $('.collapsible').collapsible();
  CodeMirrors["scriptBody"].refresh();
});

Template.code.onCreated(() => {
  $('.collapsible').collapsible();
  // CodeMirrors["scriptBody"].refresh();
});

Template.codeSettings.events({
  'change #script_name' (event) {
    this.name = String(event.target.value);
    this.save();
  },
  'click #deleteScript' (event) {
    mixpanel.track('script.remove');
    this.remove();
  }
});

Template.script_publish.events({
  'change #script_published' (event) {
    this.published = event.target.checked;
    this.save();
  }
});

Template.script_publish.helpers({
  published() {
    return this.published;
  }
});

Template.agent_list.onRendered(() => {
  $('select').material_select();
});

Template.agent_list.helpers({
  cloud_agents() {
    return Agent.find({remote: true, online: true});
  },
  status() {
    // return this.online;
    return true;
  }
});


Template.debug_api.helpers({
  paramEditorOptions() {
    return {
      lineNumbers: false,
      mode: {
        name: "javascript",
        json: true
      },
      autofocus: true
    }
  },
  url() {
    //TODO generate the MD5 in the astronomy class for scripts...
    this._md5 = md5(this._id);;
    this.save();

    return 'http://fusion360.io/api/rex/'+this._md5;
  }
});


// Template.debug_api.onRendered(()=>{
// });

Template.navbar.helpers({
  scriptActive() {
    return Session.get('activeTab') == 'scripting' ? "grey lighten-2" : "";
  },
  workgangActive() {
    return Session.get('activeTab') == 'workgang' ? "grey lighten-2" : "";
  }
});

Template.navbar.events({
  'click #workgangtNavButton' (event) {
    mixpanel.track('nav.workgang');
    Session.set('activeTab', 'workgang');
  },
  'click #scriptNavButton' (event) {
    mixpanel.track('nav.scripting');
    Session.set('activeTab', 'scripting');
  }
});


/** OLD TEMPLATES

Template.scripting.events({
  'click #send' (event, template) {
    var script = template.find('#script').value;
    var agent_id = template.find('#select_agent').value;
    if (agent_id == 'NA') {
      window.alert('You need to select an agent before running');
      return
    }
    var agent = Agent.findOne(agent_id);
    agent._script = script;
    agent._runOnce = true;
    agent.save();
    Session.setPersistent('script', script);
  }
});

Template.scripting.helpers({
  default_script() {
    return Session.get('script');
  }
});
Template.api_test.events({
  'click #send' (event, template) {
    var data = EJSON.parse(template.find('#data').value);
    if (!data) console.error('Failed to parse JSON');
    Meteor.call('sendToFusion', data);
  }
});

Template.api_test.helpers({
  response() {
    return Dashboard.findOne('response');
  }
});

Template.monitor_api.helpers({
  last_messages() {
    return Messages.find({}, { sort: { time: -1 } }).fetch();
  }
});

Template.agent_table.helpers({
  agents() {
    return Agent.find({}, { sort: { lastSeen: -1 } }).fetch();
  },
  status() {
    let status;
    let sinceLastSighting = new Date() - this.lastSeen;
    let crashed = '<i class="fa fa-ambulance" aria-hidden="true" style="color: red"></i>';
    let busy = '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>';
    let ready = '<i class="fa fa-heart" aria-hidden="true" style="animation: pulse 3s infinite"></i>';
    let disconnected = '<span class="fa-stack fa-lg"><i class="fa fa-wifi fa-stack-1x"></i><i class="fa fa-ban fa-stack-2x text-danger"></i></span>';
    console.log('sinceLastSighting: ' + sinceLastSighting)
    if (!this._runningScript) {
      // NOT running a script      
      status = sinceLastSighting > 4000 ? disconnected : ready;
    } else {
      // There was a script running, so we have to guess if we've lost
      // connection or it's just a long-running script.
      status = sinceLastSighting > 30000 ? crashed : busy;
    }
    return Spacebars.SafeString(status);
  },
  formattedLastSeen() {
    return moment(Date.now() - this.lastSeen).format('mm [min] ss [sec ago]');
  }
});

Template.agent_dropdown.helpers({
  agents() {
    return Agent.find({}, { sort: { lastSeen: -1 } }).fetch();
  },
  status() {
    let status;
    let sinceLastSighting = new Date() - this.lastSeen;
    let crashed = false;
    let busy = false;
    let ready = true;
    let disconnected = false;
    console.log('sinceLastSighting: ' + sinceLastSighting)
    if (!this._runningScript) {
      // NOT running a script      
      status = sinceLastSighting > 4000 ? disconnected : ready;
    } else {
      // There was a script running, so we have to guess if we've lost
      // connection or it's just a long-running script.
      status = sinceLastSighting > 30000 ? crashed : busy;
    }
    return status;
  }
});
**/
