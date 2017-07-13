import { HTTP } from 'meteor/http'
import { EJSON } from 'meteor/ejson'

import { Restivus } from 'meteor/nimble:restivus';

import handlebars from 'handlebars';
import text_encoding from 'text-encoding';

import Module from '/imports/collections/modules.js';
import logger from '/imports/api/logger.js';

const TextEncoder = new text_encoding.TextEncoder();

const Api = new Restivus({
  prettyJson: true,
  apiPath: '/api/cad/preview',
});

Api.addRoute(':moduleId', {
  get() {
    logger.info('*** preview endpoint for module ' + this.urlParams.moduleId);
    const module = Module.findOne({ slug: { $eq: this.urlParams.moduleId } });

    module.logAccess();
    const accessStarted = Date.now();

    const rexId = module.rexId;
    logger.info('***** looked up module ', module);
    logger.info(`***** looked up rexId ${rexId}`);

    const url = `http://${Meteor.settings.public.shift.url}/api/rex/${rexId}`
    logger.info(`***** trying HTTP POST: ${url}`);
    let data = this.urlParams;
    const filenameTemplate = handlebars.compile(module.filenameTemplate);
    const filename = filenameTemplate({
      c1: "120",
      c2: "180",
    });
    logger.info('***** with request body',data);
    let results = HTTP.post(url, { data });
    logger.info('***** received ', results);

    this.response.setHeader('Content-Type', 'application/vnd.ms-pkistl');
    this.response.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    this.response.write(EJSON.parse(results.content)); // need to strip extra set of quotes around the String response.

    module.logRun(Date.now()-accessStarted);
    module.save();

    this.done();
  },
});

Api.addRoute(':moduleId/sync', {
  get() {
    logger.info('*** synchronous preview endpoint for module ' + this.urlParams.moduleId);
    return 'reached synchronous preview endpoint for module ' + this.urlParams.moduleId;
  },
});

Api.addRoute(':moduleId/info', {
  get() {
    logger.info('*** info for preview of module ' + this.urlParams.moduleId);
    const metrics = Component.findOne({ slug: { $eq: this.urlParams.moduleId } })
      .metrics;
    logger.info('***** looked up info ', metrics);
    return {...metrics };
  },
});
