import Agent from '/imports/api/agents.js';
import Params from '/imports/parameters.js';
import Script from '/imports/api/scripts.js';
import Parameter from '/imports/parameters.js';

Meteor.publish("agents", function() {
  let user = this.userId;
  if (user) {
    console.log('publishing agents for userId: ', user);
    return Agent.find({ userId: user });
  } else {
    console.error('Not logged in');
  }
});

Meteor.publish("scripts", function() {
  return Script.find({ userId: this.userId });
});

Meteor.publish("parameters", function() {
  return Parameter.find({ userId: this.userId });
});

Meteor.publish("fusion", function(adskAccount) {
  return Agent.find({ autodeskAccount: adskAccount });;
});