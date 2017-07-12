import Agent from '/imports/collections/agents.js';
import Script from '/imports/collections/scripts.js';
import Transaction from '/imports/collections/transactions.js';;
import { Accounts } from 'meteor/accounts-base'

Meteor.publish("agents", function() {
  // if (this.userId) {
    console.log('publishing agents for userId: ', this.userId);
    return [
      Agent.find({ user_id: this.userId }),
      Transaction.find({ user_id: this.userId })
    ];
  // } else {
    console.error('Not logged in');
  // }
});

Meteor.publish("scripts", function() {
  return Script.find({ userId: this.userId });
});

Meteor.publish("fusion", function(adsk_id) {
  var user_id = Accounts.users.findOne({autodesk_id: adsk_id})._id;
  console.log('publishing fusion for user:', user_id)
  console.log('publishing '+Agent.find({ user_id }).count()+" agents");
  console.log('publishing '+Transaction.find({ user_id }).count()+" transactions");
  return [
    Agent.find({ user_id }),
    Transaction.find({ user_id })
  ];
});

Meteor.publish("palette", function(agent_id) {
  console.log('Publishing for palette agent_id '+agent_id);
  var agent = Agent.findOne({ _id: agent_id });
  console.log('Found agent '+agent._id)
  var user = Accounts.users.findOne({_id: agent.user_id});

  console.log('publishing fusion for user:', user._id)
  console.log('publishing '+Agent.find({ _id: agent_id }).count()+" agents");
  console.log('publishing '+Transaction.find({ agent_id }).count()+" transactions");
  return [
    Agent.find({ _id: agent_id }),
    Transaction.find({ agent_id })
  ];
});
