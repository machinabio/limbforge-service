import { Meteor } from 'meteor/meteor';
// import { EJSON } from 'meteor/ejson'
// import { check } from 'meteor/check';
// import { Random } from 'meteor/random';

// import { Class } from 'meteor/jagi:astronomy';

const components = new Mongo.Collection('components');

if (components.find({}).count() == 0) {
  console.warn('Components collection empty, adding seeds.');

  components.insert({
    component_id: 'f7fbde2f3e5cac3548874b51188e56c5',
    filename: 'foobar.stl'
  });
  components.insert({
    component_id: '0d4f9a5b95aee7eb2ce0c5d2313a374f',
    filename: 'barfoo.stl'
  });
};

export default components;
