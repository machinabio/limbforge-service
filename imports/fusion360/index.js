// import '/imports/fusionUtilities.js';
import Agent from '/imports/api/agents.js';
import namor from 'namor';
import './index.html'

if (Meteor.isFusion360) {
  // Loading the Fusion API's on a web browsers causes errors.
  import '/imports/fusion360/api/';
  Session.setDefault('agentId', null);
};

Template.fusionClientLayout.helpers({
  agent() {
    return Agent.findOne(Session.get('agentId'));
  }
});

Template.fusionClientLayout.onRendered(() => {
  if (Session.equals('agentId', null)) {
    Meteor.call("printLog", "...retrieving agentId");
    HTTP.get('/api/retrieveId', (err, res) => {
      Session.setPersistent('agentId', res.content);
    });
  }
});


// var app = adsk.core.Application.get();
// var ui = app.userInterface;
// ui.messageBox('Emdedded Fusion360 microserver started.');
