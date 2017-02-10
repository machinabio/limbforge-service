import Agent from '/imports/api/agents.js';
import namor from 'namor';
import { Accounts } from 'meteor/accounts-base'

let Api = new Restivus({
  prettyJson: true
});

Api.addRoute('retrieveId/:adskAccount', {
  get: function() {
    // mixpanel('worker.checkin', { autodeskAccount: this.urlParams.adskAccount, ip: this.request.headers.host });
    // mixpanel.track('worker.checkin');
    var done = this.done;
    var response = this.response;
    // console.log(this);
    response.writeHead(200, 'retrieving id', {
      // 'Content-Type': 'application/json'
      'Content-Type': 'text/plain'
    });
    var agent = Agent.findOne({ autodeskAccount: this.urlParams.adskAccount });
    if (!agent) {
      // mixpanel('worker.new', { autodeskAccount: this.urlParams.adskAccount, ip: this.request.headers.host });
      // mixpanel.track('worker.new');
      agent = new Agent();
      agent.name = namor.generate({ words: 3, numbers: 4, manly: true });
      agent.autodeskAccount = this.urlParams.adskAccount;
    }
    try {
      console.log('looking up account by email ' + agent.autodeskAccount);
      agent.userId = Accounts.findUserByEmail(agent.autodeskAccount)._id;
    } catch (e) {
      console.error('failed to find a matching autodeskAccount');
    }
    agent.foreman = Meteor.settings.shift.foreman.name;
    agent.save(() => {
      this.response.write(agent._id);
      this.done();
    });
  }
});
