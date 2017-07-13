import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';
import logger from '/imports/api/logger.js';

// import { check } from 'meteor/check';

const Modules = new Mongo.Collection('modules');

const Metrics = Class.create({
  name: 'Metrics',
  fields: {
    averageGenerationTime: {
      type: Number,
      optional: true,
      transient: true,
    },
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
    generationHistory: {
      type: [Number],
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
  helpers: {
    logAccess() {
      logger.info('accessing module '+this.slug);
      const metrics = this.metrics;
      metrics.lastAccessedAt = new Date();
      this.save();
    },
    logGenerationTime(milliseconds) {
      logger.info('logging excution time ('+milliseconds+' ms) for module '+this.slug);
      const metrics = this.metrics;
      // const Component = this.constructor;
      // Component.update(this._id, {
      //   $push: {
      //     'metrics.generationHistory': {
      //      $each: [ milliseconds ],
      //       $slice: -100,
      //   }
      // }, callback);
      this.save();
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
