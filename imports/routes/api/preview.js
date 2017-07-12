import jsend from 'jsend';
import handlebars from 'handlebars';

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
    logger.info('***** looked up component ', component);
    logger.info(`***** looked up rexId ${rexId}`);

    const url = `http://${Meteor.settings.public.shift.url}/api/rex/${rexId}`
    logger.info(`***** trying HTTP POST: ${url}`);
    let data = this.urlParams;
    const filenameTemplate = handlebars.compile(component.filename);
    const filename = filenameTemplate({
      c1: "120",
      c2: "180",
    });
    logger.info(`***** with request body ${data}`);
    console.log('***** with request body', data);
    let results = HTTP.post(url, { data });
    logger.info('***** received ', results);
    results.body = results.content;
    results.headers['Content-Disposition'] = `inline; filename="${filename}"`
    delete results.data;
    console.log('***** received ', results);
    component.logGenerationTime(accessStarted - Date.now());
    component.save();

    return results;
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
