import { Template } from 'meteor/templating';
import { Messages } from '/imports/messages.js';
import { EJSON } from 'meteor/ejson';
import { Dashboard } from '/imports/dashboard.js';
import { CadMake } from '/imports/cadmake.js';
import Agent from '/imports/api/agents.js';
import './index.html';

Template.api_test.events({
  'click #send'(event, template) {
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
  	return Messages.find({}, { sort: { time: -1 }}).fetch();
  }
});

Template.agent_list.helpers({
  agents() {
    return Agent.find({}, { sort: { lastSeen: -1 }}).fetch();
  }
});

