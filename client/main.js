import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.send_data.events({
  'click #send'(event, template) {
  	var data = template.find('#data').value;
    Meteor.call('sendToFusion', JSON.stringify(data));
  },
});
