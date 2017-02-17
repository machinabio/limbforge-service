import { Class } from 'meteor/jagi:astronomy';

const Scripts = new Mongo.Collection('scripts');
const Script = Class.create({
  name: 'Script',
  collection: Scripts,
  fields: {
    code: {
      type: String,
      optional: true
    },
    name: {
      type: String,
      optional: true
    },
    userId: {
      type: String,
      optional: true
    },
    parameters: {
      type: String,
      optional: true
    },
    published: {
      type: Boolean,
      optional: true
    },
    _md5: {
      type: String,
      optional: true
    }
  },
  behaviors: {},
  events: {},
  secured: false
});

// var doc = {};
// doc.userId = 'xxx';
// doc.code = '//test';
// Scripts.insert(doc);

export default Script;
