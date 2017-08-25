// import { Meteor } from "meteor/meteor";
// import { Tracker } from 'meteor/tracker'

// import { analytics } from "meteor/okgrow:analytics";

// Meteor.startup(function() {
//   Tracker.autorun(function() {
//     var user = Meteor.user();
//     if (!user) return;
//     analytics.identify(user._id);

//     person = {
//       "Name": user.emails[0].address,

//       // special mixpanel property names
//       "$created": user.createdAt.toISOString(),
//       "$email": user.emails[0].address
//       // "$id": xxxxx.getAutodeskId(); // want to get the adsk user hash ... 
//     }

//     analytics.people.set(person);
//     analytics.register({
//       "autodesk_account": user.emails[0].address
//     });
//   });
// });
