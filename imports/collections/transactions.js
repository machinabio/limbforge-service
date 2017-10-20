import { Class } from 'meteor/jagi:astronomy';
import { EJSON } from 'meteor/ejson';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const transactions = new Mongo.Collection('transactions');

export default (Transaction = Class.create({
  name: 'Transaction',
  collection: transactions,
  fields: {
    data: {
      type: Object,
      optional: true,
    },
    response: {
      type: String,
      optional: true,
      default: undefined,
    },
    script_id: {
      type: String,
      optional: true,
    },
    start_time: {
      type: Date,
      optional: true,
    },
    finish_time: {
      type: Date,
      optional: true,
    },
    read_time: {
      type: Date,
      optional: true,
    },
    queued_time: {
      type: Date,
      optional: true,
    },
    agent_id: {
      type: String,
      optional: true,
    },
    user_id: {
      type: String,
      optional: true,
    },
  },
  secured: false,
}));

if (Meteor.isServer) {
  transactions
    .rawCollection()
    .ensureIndex({ read_time: 1 }, { expireAfterSeconds: 30 });
}
