import { Restivus } from 'meteor/nimble:restivus';
import { HTTP } from 'meteor/http'
import Component from '/imports/collections/components.js';
import logger from '/imports/api/logger.js';

const Api = new Restivus({
  prettyJson: true,
  apiPath: '/api/cad/preview',
});

Api.addRoute(':componentId', {
  get() {
    logger.info('*** preview endpoint for component ' + this.urlParams.componentId);
    const component = Component.findOne({ slug: { $eq: this.urlParams.componentId } });

    component.logAccess();
    const accessStarted = Date.now();

    const rexId = component.rexId;
    logger.info(`***** looked up rexId ${rexId}`);

    const options = {};
    const url = `http://${Meteor.settings.shift.foreman.url}/api/rex/${rexId}`
    logger.info(`***** trying HTTP Get: ${url}`);
    const results = HTTP.post(url, options);
    logger.info(`***** received {$results}`);

    component.logGenerationTime(accessStarted - Date.now());
    component.save();
    return 'reached preview endpoint for component ' + this.urlParams.componentId;
  },
});

Api.addRoute(':componentId/sync', {
  get() {
    logger.info('*** synchronous preview endpoint for component ' + this.urlParams.componentId);
    return 'reached synchronous preview endpoint for component ' + this.urlParams.componentId;
  },
});

Api.addRoute(':componentId/info', {
  get() {
    logger.info('*** info for preview of component ' + this.urlParams.componentId);
    const metrics = Component.findOne({ slug: { $eq: this.urlParams.componentId } })
      .metrics;
    logger.info('***** looked up info ', metrics);
    return {...metrics };
  },
});
