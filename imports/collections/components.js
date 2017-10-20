import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';
import logger from '/imports/api/logger.js';

// import { check } from 'meteor/check';

const Components = new Mongo.Collection('components');

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
      type: Date,
    },
    generationHistory: {
      type: [Number],
      optional: true,
    },
  },
});

const Component = Class.create({
  name: 'Component',
  collection: Components,
  fields: {
    slug: {
      type: String,
    },
    rexId: String,
    filename: {
      type: String,
      optional: true,
    },
    metrics: Metrics,
  },
  helpers: {
    logAccess() {
      logger.info('accessing component ' + this.slug);
      const metrics = this.metrics;
      metrics.lastAccessedAt = new Date();
      this.save();
    },
    logGenerationTime(milliseconds) {
      logger.info(
        'logging excution time (' +
          milliseconds +
          ' ms) for component ' +
          this.slug,
      );
      const metrics = this.metrics;
      // const Component = this.constructor;
      // Component.update(this._id, {
      //   $push: {
      //     'metrics.generationHistory': {
      //     	$each: [ milliseconds ],
      //       $slice: -100,
      //   }
      // }, callback);
      this.save();
    },
  },
  events: {
    afterInit(event) {
      const component = event.currentTarget;
      // const Class = component.constructor;
      // const rawCollection = Class.getCollection();
      // var average = rawCollection.find({slug:{$eq:component.slug}}).aggregate()
      component.averageGenerationTime = 10;
      logger.info(
        'computed transient field "averageGenerationTime" to ' +
          component.averageGenerationTime +
          ' for component',
      );
    },
  },
});

if (Components.find({}).count() == 0) {
  console.warn('Components collection empty, adding seeds.');
  Components.insert({
    component_id: 'f7fbde2f3e5cac3548874b51188e56c5',
    filename: 'foobar.stl',
  });
  Components.insert({
    component_id: '0d4f9a5b95aee7eb2ce0c5d2313a374f',
    filename: 'barfoo.stl',
  });
}

export default Component;
