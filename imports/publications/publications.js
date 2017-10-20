import Agent from '/imports/collections/agents.js';
import Script from '/imports/collections/scripts.js';
import Transaction from '/imports/collections/transactions.js';
import { Accounts } from 'meteor/accounts-base';

Meteor.publish('agents', function() {
  if (this.userId) {
    console.log(`publishing agents for userId: ${this.userId})`);
    return [
      Agent.find({ user_id: this.userId }),
      Transaction.find({ user_id: this.userId }),
    ];
  } else {
    console.error('Not logged in');
  }
});

Meteor.publish('scripts', function() {
  return Script.find({ userId: this.userId });
});

Meteor.publish('fusion', function(agentId) {
  const agent = Agent.findOne(agentId);
  const user = Accounts.users.findOne({ _id: agent.user_id });

  console.log('publishing FUSION for user:', user.emails[0].address);
  console.log(
    'publishing ' +
      Transaction.find({ agent_id: agentId }).count() +
      ' transactions',
  );
  return [Agent.find(agentId), Transaction.find({ agent_id: agentId })];
});

Meteor.publish('palette', function(agentId) {
  var agent = Agent.findOne(agentId);
  var user = Accounts.users.findOne(agent.user_id);

  console.log('publishing PALETTE for user:', user.emails[0].address);
  console.log('publishing ' + Agent.find({ _id: agentId }).count() + ' agents');
  console.log(
    'publishing ' +
      Transaction.find({ agent_id: agentId }).count() +
      ' transactions',
  );
  return [Agent.find(agentId), Transaction.find({ agent_id: agentId })];
});
