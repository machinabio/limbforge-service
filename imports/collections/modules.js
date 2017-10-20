import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';
import logger from '/imports/api/logger.js';
import Qty from 'meteor/fathom:quantities';

// import { check } from 'meteor/check';

const Modules = new Mongo.Collection('modules');

const Metrics = Class.create({
  name: 'Metrics',
  fields: {
    filesize: {
      type: Number,
      optional: true,
    },
    cached: {
      type: Boolean,
      optional: true,
    },
    generatedAt: {
      type: Date,
      optional: true,
    },
    lastAccessedAt: {
      type: Date,
    },
    runTimes: {
      type: [Number],
      optional: true,
    },
    runTimeStats: {
      type: Object,
      optional: true,
    },
  },
});

const Measurements = Class.create({
  name: 'Measurements',
  fields: {
    name: String, // displayed
    instructions: String, // displayed
    slug: String, // internal. must be unique.
    step: Number,
    upper_range: Number,
    lower_range: Number,
    default: Number,
  },
});

const Module = Class.create({
  name: 'Module',
  collection: Modules,
  fields: {
    slug: {
      type: String,
    },
    rexId: String,
    filenameTemplate: {
      type: String,
      optional: true,
    },
    metrics: {
      type: Metrics,
      optional: true,
    },
    meaurements: {
      type: Measurements,
      optional: true,
    },
  },
  meteorMethods: {
    logAccess() {
      this.set('metrics.lastAccessedAt', new Date());

      logger.info('accessed module ' + this.slug);
    },
    logRun(milliseconds) {
      // logger.info(`logged excution time (${milliseconds} ms) for module ${this.slug}`);
      // logger.info('metrics object', this.metrics)
      // logger.info('runTime history ', this.metrics.runTimes);

      const modified = this.metrics.runTimes.concat(Number(milliseconds));

      this.set('metrics.runTimes', modified);

      // this.metrics.runTimes = modified;
      // this.save({ fields: ['metrics'] });

      logger.info(
        `logged excution time (${milliseconds} ms) for module ${this.slug}`,
      );
      // logger.info('runTime history ', this.metrics.runTimes);
      // logger.info('runTime modified ', modified);
      logger.info('metrics object', this.metrics);
    },
  },
  events: {
    afterInit(event) {
      // need to figure out how to initialize a transient field!
      // const module = event.currentTarget;
      // const Class = module.constructor;
      // const rawCollection = Class.getCollection();
      // var average = rawCollection.find({slug:{$eq:module.slug}}).aggregate()
      // module.averageGenerationTime = 10;
      // logger.info('computed transient field "averageGenerationTime" to '+module.averageGenerationTime+' for module');
    },
  },
});

export default Module;
