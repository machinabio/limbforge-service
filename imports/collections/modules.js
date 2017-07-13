import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';
import logger from '/imports/api/logger.js';

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
      type: Date
    },
    runTimes: {
      type: [Number],
      optional: true
    },
    runTimeStats: {
      type: Object,
      optional: true
    },
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
    metrics: Metrics
  },
  meteorMethods: {
    logAccess() {
      this.metrics.lastAccessedAt = new Date();
      this.save();

      logger.info('accessed module '+this.slug);
    },
    logRun(milliseconds) {
      this.metrics.runTimes = this.metrics.runTimes.concat(milliseconds).slice(-100);
      this.save();

      logger.info(`logged excution time (${milliseconds} ms) for module ${this.slug}`);
      logger.info('runTime history ', this.metrics.runTimes);
      logger.info('metrics object', this.metrics)
    }
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
    }
  },
});

export default Module;
