import { Class } from 'meteor/jagi:astronomy';
import { EJSON } from 'meteor/ejson';


const transactions = new Mongo.Collection('transactions');

export default Transaction = Class.create({
  name: 'Transaction',
  collection: transactions,
  fields: {
    data: {
      type: Object,
      optional: true
    },
    response: {
      type: String,
      optional: true,
      default: undefined
    },
    script_id: {
      type: String,
      optional: true
    },
    start_time: {
      type: Date,
      optional: true
    },
    finish_time: {
      type: Date,
      optional: true
    },
    queued_time: {
      type: Date,
      optional: true
    },
    agent_id: {
      type: String,
      optional: true
    },
    user_id: {
      type: String,
      optional: true
    }
  },
  secured: false
});
