import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { EJSON } from 'meteor/ejson';

import moment from 'moment';
import md5 from 'md5';

// import { analytics } from 'meteor/okgrow:analytics';

import Agent from '/imports/collections/agents.js';
import Script from '/imports/collections/scripts.js';
import Transaction from '/imports/collections/transactions.js';

import './index.html';

Meteor.subscribe('agents');
Meteor.subscribe('scripts');
// Meteor.subscribe('parameters');

Session.setDefault('activeTab', 'scripting');

Template.webClientLayout.onRendered(() => {
  Tracker.autorun(() => {
    BlazeLayout.render('webClientLayout', {
      body: Session.get('activeTab'),
    });
  });
});

Template.scriptList.helpers({
  scripts() {
    return Script.find({}, { sort: { name: 1 } });
  },
  active() {
    return this._id == Session.get('activeScript') ? 'active' : '';
  },
});

Template.scriptList.events({
  'click .collection-item'(event) {
    Session.set('activeScript', this._id);
    event.preventDefault();
  },
  'click #newScript'(event) {
    // analytics.track('script.new');
    var script = new Script();
    script.name = 'new script';
    script.userId = Meteor.userId();
    script.save(() => {
      Session.set('activeScript', script._id);
    });
  },
});

Template.code.events({
  'click #runScript'(event) {
    let agent = Agent.getLocal();
    if (!agent) {
      console.error(
        'No local agent found for autodesk ID ' +
          Meteor.user().emails[0].address,
      );
      return;
    }
    // analytics.track('script.execute');
    let params = {
      script_id: Session.get('activeScript'),
      agent_id: agent._id,
      data: {},
    };
    Meteor.call('rex_enqueue', params);
  },
});

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
      mode: 'javascript',
      autofocus: true,
    };
  },
});

Template.code.onRendered(() => {
  $('.collapsible').collapsible();
  CodeMirrors['scriptBody'].refresh();
});

Template.code.onCreated(() => {
  $('.collapsible').collapsible();
  // CodeMirrors["scriptBody"].refresh();
});

Template.codeSettings.events({
  'change #script_name'(event) {
    this.name = String(event.target.value);
    this.save();
  },
  'click #deleteScript'(event) {
    // analytics.track('script.remove');
    this.remove();
  },
  'click #copyScript'(event) {
    // analytics.track('script.copy');
    this.copy().save();
  },
});

Template.script_publish.events({
  'change #script_published'(event) {
    this.published = event.target.checked;
    this.save();
  },
});

Template.script_publish.helpers({
  published() {
    return this.published;
  },
});

Template.agent_dropdown.onRendered(() => {
  $('select').material_select();
});

Template.agent_dropdown.helpers({
  cloud_agents() {
    var agent_list = [];
    agent_list.push({ _id: 'next_available', name: 'Next available' });
    agent_list = agent_list.concat(Agent.getCloud().fetch());
    return agent_list;
  },
});

Template.agent_count.helpers({
  count() {
    // var agent_list = [];
    // agent_list.push({_id: 'next_available', name: 'Next available'})
    // agent_list = agent_list.concat(Agent.getCloud().fetch());
    return Agent.getCloud().count();
  },
});

Template.agent_collection.helpers({
  agents() {
    var agent_list = [];
    var local_agent = Agent.getLocal();
    var cloud_agents = Agent.getCloud().fetch();

    if (local_agent) {
      local_agent.name += ' (local)';
      agent_list.push(local_agent);
    }
    if (cloud_agents) {
      agent_list = agent_list.concat(cloud_agents);
    }
    return agent_list;
  },
});

Template.agent_details.helpers({
  agent() {
    return Agent.findOne(Session.get('active_agent_collection_item'));
  },
  type() {
    return this.remote ? 'Cloud' : 'Desktop';
  },
  busy() {
    return this._runningScript ? 'Running a script' : 'Idle';
  },
  last_seen() {
    //TODO format in local/relative units
    return this.lastSeen;
  },
  status() {
    if (this._runningScript) {
      return 'Running a script';
    }
    if (this.online) {
      return 'Online';
    }
    return 'No information';
  },
});

Template.agent_collection.events({
  'click .collection-item'(event) {
    Session.set('active_agent_collection_item', this._id);
    event.preventDefault();
  },
});

Template.agentList.events({
  'click #new_agent'(event) {
    Agent.spawn();
  },
});

Template.agent_collection_item.helpers({
  active() {
    if (this._id == Session.get('active_agent_collection_item')) {
      return 'active';
    } else {
      return '';
    }
  },
});

Template.debug_api.helpers({
  paramEditorOptions() {
    return {
      lineNumbers: false,
      mode: {
        name: 'javascript',
        json: true,
      },
      autofocus: true,
    };
  },
  url() {
    //TODO generate the MD5 in the astronomy class for scripts...
    this._md5 = md5(this._id);
    this.save();
    return 'https://fusion360.io/api/rex/' + this._md5;
  },
  response() {
    let transaction = Transaction.findOne(Session.get('transaction_id'));
    if (!transaction) return 'No response';
    console.log('Transaction: ', transaction);
    return transaction.response;
  },
});

Template.debug_api.events({
  'click #runCloudScript'(event) {
    var script = Script.findOne();
    // var data = {foo:"bar"};
    var data = EJSON.parse(Session.get('cloud_params'));
    Meteor.call(
      'rex_enqueue',
      { script_id: Session.get('activeScript'), data: data },
      (error, result) => {
        console.log('rex_enqueue result was ', result);
        Session.set('transaction_id', result);
      },
    );
  },
});

Template.navbar.helpers({
  scriptActive() {
    return Session.get('activeTab') == 'scripting' ? 'grey lighten-2' : '';
  },
  workgangActive() {
    return Session.get('activeTab') == 'workgang' ? 'grey lighten-2' : '';
  },
});

Template.navbar.events({
  'click #workgangtNavButton'(event) {
    // analytics.track('nav.workgang');
    Session.set('activeTab', 'workgang');
  },
  'click #scriptNavButton'(event) {
    // analytics.track('nav.scripting');
    Session.set('activeTab', 'scripting');
  },
});
