import Agent from '/imports/api/agents.js';
import namor from 'namor';

let Api = new Restivus({
  prettyJson: true
});

Api.addRoute('retrieveId', {
  get: function () {
  	var done = this.done;
    var response = this.response;
    // console.log(this);
    response.writeHead(200, 'retrieving id', {
      // 'Content-Type': 'application/json'
      'Content-Type': 'text/plain'
    });
    var agent = new Agent();
    agent.name = namor.generate({ words: 2, numbers: 3, manly: true });
    agent.save(() => {
      this.response.write(agent._id);
      this.done();
    });
  }
});

// Template.fusionClientLayout.onRendered(() => {
//   try {
//     var agent = Session.get('agent');
//   } catch (e) {
//     Meteor.call("printLog", "...Error retrieving agent from Session");
//   }
//   if (!agent) {
//     agent = new Agent();
//     agent.name = namor.generate({ words: 2, numbers: 3, manly: true });
//     agent.lastSeen = new Date();
//     agent.save((args) => {
//       Meteor.call("printLog", "...Created new agent");
//     });
//   }
//   // debugger;
//   // agent.startHeartbeat();
// });
