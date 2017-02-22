import { Class } from 'meteor/jagi:astronomy';

const transactions = new Mongo.Collection('transactions');

// params.insert({ name: "filet", value: 2, design: "test" });
// params.insert({ name: "length", value: 10, design: "test" });
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
