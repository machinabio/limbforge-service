Meteor.isFusion360 = navigator.userAgent.includes('Neutron');

if (Meteor.isFusion360) {
  Meteor.call('printLog', 'Client connected from Fusion360');
  import '../imports/fusion360/';
} else {
  Meteor.call('printLog', 'Client connected from browser');
  import '../imports/browser/';
}
