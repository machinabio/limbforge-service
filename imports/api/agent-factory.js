import Agent from '/imports/api/agents.js';
import namor from 'namor';
import { Accounts } from 'meteor/accounts-base'

let Api = new Restivus({
  prettyJson: true
});

Api.addRoute('retrieveId/:adskAccount', {
  get: function() {
    var done = this.done;
    var response = this.response;
    // console.log(this);
    response.writeHead(200, 'retrieving id', {
      // 'Content-Type': 'application/json'
      'Content-Type': 'text/plain'
    });
    var agent = Agent.findOne({ autodeskAccount: this.urlParams.adskAccount });
    if (!agent) {
      agent = new Agent();
      agent.name = namor.generate({ words: 2, numbers: 3, manly: true });
      agent.autodeskAccount = this.urlParams.adskAccount;
      try {
        console.log('looking up account by email ' + agent.autodeskAccount);
        agent.userId = Accounts.findUserByEmail(agent.autodeskAccount)._id;
      } catch (e) {

      }
    }
    agent.foreman = Meteor.settings.shift.foreman.name;
    agent.save(() => {
      this.response.write(agent._id);
      this.done();
    });
  }
});
