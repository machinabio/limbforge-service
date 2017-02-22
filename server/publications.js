import Agent from '/imports/api/agents.js';
import Params from '/imports/parameters.js';
import Script from '/imports/api/scripts.js';
import Parameter from '/imports/parameters.js';
import Transaction from '/imports/models/transaction.js';
import { Accounts } from 'meteor/accounts-base'

Meteor.publish("agents", function() {
  let user = this.userId;
  if (user) {
    console.log('publishing agents for userId: ', user);
    return [
      Agent.find({ userId: user }),
      Transaction.find({ user_id: user })
    ];
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
  var user_id = Accounts.findUserByEmail(adskAccount)._id;
  console.log('publishing fusion for user:', user_id)
  return [
    Agent.find({ autodeskAccount: adskAccount }),
    Transaction.find({ user_id: user_id })
  ];
});
