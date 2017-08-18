import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import logger from '/imports/api/logger.js';

import humanInterval from 'human-interval';

import Agent from '/imports/collections/agents.js';

import '/imports/startup/client.js';

const timeout = humanInterval('2 seconds'); // seconds we retry fetching an agent ID

FlowRouter.route('/', {
  action(params) {
    if (Meteor.isFusion360) {
      window.location.replace(
        Meteor.absoluteUrl('fusion360', { replaceLocalhost: true })
      );
    }
    import '/imports/ui/browser';

    Meteor.subscribe('agents');
    Meteor.subscribe('scripts');

    Meteor.call('printLog', '...connection on / route');
    BlazeLayout.render('App_body', { main: 'webClientLayout' });
  },
});

FlowRouter.route('/palette/:agentId', {
  action(params) {
    if (!Meteor.isFusion360) {
      window.location.replace(
        Meteor.absoluteUrl('', { replaceLocalhost: true })
      );
    }

    import '/imports/ui/palette';

    Meteor.call(
      'printLog',
      '...connection on /palette route from agent id ' + params.agentId
    );

    Meteor.subscribe('palette', params.agentId, {
      onReady() {
        BlazeLayout.render('App_body', { main: 'paletteLayout' });
      },
    });
  },
});

FlowRouter.route('/fusion360', {
  action() {
    if (!Meteor.isFusion360) {
      window.location.replace(
        Meteor.absoluteUrl('', { replaceLocalhost: true })
      );
    }

    Meteor.call('printLog', '...connection on /fusion360 route');
    Meteor.call(
      'printLog',
      'Fusion360 agent capabilities:',
      navigator.userAgent
    );
    import { initPalette } from '/imports/api/fusion360js';
    const params = {
      adskEmail: adsk.core.Application.get().userName,
      adskId: adsk.core.Application.get().userId,
    };

    HTTP.get('/api/retrieveId', { params }, (err, res) => {
      Meteor.subscribe('fusion', res.data.agentId, {
        onReady() {
          import '/imports/ui/fusion360';
          initPalette();

          Agent.initialize(res.data.agentId);
          BlazeLayout.render('App_body', { main: 'fusionClientLayout' });
        },
      });
    });
  },
});

FlowRouter.route('/agent', {
  action() {
    if (!Meteor.isFusion360) {
      window.location.replace(
        Meteor.absoluteUrl('', { replaceLocalhost: true })
      );
    }

    import Agent from '/imports/collections/agents.js';

    Meteor.call('printLog', '...connection on /agent route');
    Meteor.call(
      'printLog',
      'Fusion360 agent capabilities:',
      navigator.userAgent
    );
    import { initPalette } from '/imports/api/fusion360js';
    const params = {
      adskEmail: adsk.core.Application.get().userName,
      adskId: adsk.core.Application.get().userId,
    };

    HTTP.get('/api/retrieveAgent', { params }, (err, res) => {
      Meteor.subscribe('fusion', res.data.agentId, {
        onReady() {
          import '/imports/ui/fusion360';
          initPalette();

          Agent.initialize(res.data.agentId);
          BlazeLayout.render('App_body', { main: 'fusionClientLayout' });
        },
      });
    });
  },
});
