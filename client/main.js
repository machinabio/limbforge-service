import { Template } from 'meteor/templating';
import { Messages } from '/imports/messages.js';
import { EJSON } from 'meteor/ejson';
import './main.html';

Template.test_api.events({
  'click #send'(event, template) {
  	var data = EJSON.parse(template.find('#data').value);
  	if (!data) console.error('Failed to parse JSON');
  	console.log(data);
    Meteor.call('sendToFusion', data);
  }
});

Template.monitor_api.helpers({
  last_messages() {
  	return Messages.find({}, { sort: { time: -1 }}).fetch();
  }
});

