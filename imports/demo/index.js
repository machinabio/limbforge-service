import { Template } from 'meteor/templating';
import Agent from '/imports/api/agents.js';
import './index.html';
import Params from '/imports/parameters.js';

Template.parameters_editor.events({
  'change'(event, template) {
    this.value = Number(event.target.value);
    this.save();
  }
});

Template.parameters_editor.helpers({
get_params() {
    return Params.find({});
  },
});


