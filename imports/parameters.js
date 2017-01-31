import { Class } from 'meteor/jagi:astronomy';


const params = new Mongo.Collection('parameters');

// Params.insert({ name: "filet", value: 2, design: "test" });
// Params.insert({ name: "length", value: 10, design: "test" });
export default Params = Class.create({
  name: 'Param',
  collection: params,
  fields: {
    name: String,
    value: Number
  },
  secured: false
});