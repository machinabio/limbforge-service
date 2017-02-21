import { Class } from 'meteor/jagi:astronomy';

const transactions = new Mongo.Collection('transactions');

// params.insert({ name: "filet", value: 2, design: "test" });
// params.insert({ name: "length", value: 10, design: "test" });
export default Transaction = Class.create({
  name: 'Transaction',
  collection: transactions,
  fields: {
    data: {
    	type: String,
    	optional: true
    },
    script: {
    	type: String,
    	optional: true
    }
  },
  secured: false
});
