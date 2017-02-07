import { Class } from 'meteor/jagi:astronomy';

const params = new Mongo.Collection('parameters');

// params.insert({ name: "filet", value: 2, design: "test" });
// params.insert({ name: "length", value: 10, design: "test" });
export default Params = Class.create({
  name: 'Param',
  collection: params,
  fields: {
    name: String,
    value: Number
  },
  secured: false
});