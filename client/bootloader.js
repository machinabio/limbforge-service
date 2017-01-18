// if (typeof adsk === 'object') {
//   Meteor.call('printLog', 'Running inside of Fusion360');
//   console.log("Adsk typeof ", typeof adsk);
//   console.log("Window typeof ", typeof window); // object
//   console.log("Process typeof ", typeof process); // object
//   console.log("Process.versions  ", process.versions); //object
//   console.log("Process.versions.node  ", process.versions.node); //undefined
//   require('../imports/fusion360/index.js');
// } else {

Meteor.call('printLog', 'Running inside of browser');
console.log("Adsk typeof ", typeof adsk);
console.log("Window typeof ", typeof window); // object
console.log("Process typeof ", typeof process); // object
console.log("Process.versions  ", process.versions); //object
console.log("Process.versions.node  ", process.versions.node); //undefined

import '../imports/fusion360/index.js';

console.log('done with script');