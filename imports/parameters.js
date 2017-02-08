import { Class } from 'meteor/jagi:astronomy';

const params = new Mongo.Collection('parameters');

// params.insert({ name: "filet", value: 2, design: "test" });
// params.insert({ name: "length", value: 10, design: "test" });
export default Params = Class.create({
  name: 'Param',
  collection: params,
  fields: {
    name: {
    	type: String,
    	optional: true
    },
    value: {
    	type: Number,
    	optional: true
    },
    userId: {
    	type: String,
    	optional: true
    }
  },
  secured: false
});
