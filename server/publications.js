import Agent from '/imports/api/agents.js';
import Params from '/imports/parameters.js';
import Script from '/imports/api/scripts.js';
import Parameter from '/imports/parameters.js';
import Transaction from '/imports/models/transaction.js';
import { Accounts } from 'meteor/accounts-base'

Meteor.publish("agents", function() {
  if (this.userId) {
    console.log('publishing agents for userId: ', this.userId);
    return [
      Agent.find({ user_id: this.userId }),
      Transaction.find({ user_id: this.userId })
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

Meteor.publish("fusion", function(adskId) {
  var user = Accounts.users.findOne({autodesk_id: adskId});
  console.log('publishing fusion for user:', user._id)
  console.log('publishing '+Agent.find({ user_id: user._id }).count()+" agents");
  console.log('publishing '+Transaction.find({ user_id: user._id }).count()+" transactions");
  return [
    Agent.find({ user_id: user._id }),
    Transaction.find({ user_id: user._id })
  ];
});
