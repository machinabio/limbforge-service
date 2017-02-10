Meteor.startup(function() {
  Tracker.autorun(function() {
    var user = Meteor.user();
    if (!user) return;
    mixpanel.identify(user._id);

    person = {
      "Name": user.emails[0].address,

      // special mixpanel property names
      "$email": user.emails[0].address,
      "$created": user.createdAt.toISOString()
    }

    mixpanel.people.set(person);
    mixpanel.register({
      "autodesk_account": user.emails[0].address
    });
  });
});
