import uiSeeds from '/imports/api/ui-seeds.js';
import { Restivus } from 'meteor/nimble:restivus';
import { check } from 'meteor/check';

let Api = new Restivus({
  prettyJson: true,
  apiPath: '/api/ui',
});

Api.addRoute('amputationLevels', {
  get() {
    const amputationLevels = uiSeeds
      .rawCollection()
      .distinct('amputationLevels')
      .await();
    return { amputationLevels };
  },
});

Api.addRoute('recipe', {
  get() {
    const recipe = uiSeeds
      .rawCollection()
      .distinct('type')
      .await();
    return { recipe };
  },
});

Api.addRoute('modules', {
  get() {
    const amputationLevel = this.queryParams.amputationLevel;
    check(amputationLevel, String);
    const fields = {
      _id: false,
      slug: true,
      name: true,
      icon: true,
      creator: true,
      componentType: true,
      weight: true,
      description: true,
      uses: true,
      printTime: true,
      revision: true,
    };
    const modules = uiSeeds
      .find({ 'amputationLevels.slug': amputationLevel }, { fields })
      .fetch();
    return { modules };
  },
});

Api.addRoute('parameters', {
  get() {
    const device = this.queryParams.device;
    check(device, String);
    const fields = {
      _id: false,
      parameters: true,
    };
    // console.log('request for parameters of device ', device)
    const parameters = uiSeeds.findOne({ slug: { $eq: device } }, { fields })
      .parameters;
    return { parameters };
  },
});

Api.addRoute('measurements', {
  get() {
    const amputationLevel = this.queryParams.amputationLevel;

    check(amputationLevel, String);
    const fields = {
      _id: false,
      measurements: true,
    };
    const measurements = uiSeeds.findOne(
      { 'amputationLevels.slug': amputationLevel },
      { fields },
    ).measurements;

    return { measurements };
  },
});

Api.addRoute('terminalDevices', {
  get() {
    const device = this.queryParams.device;
    check(device, String);
    const fields = {
      _id: false,
      terminalDevices: true,
    };
    const terminalDevices = uiSeeds.findOne(
      { slug: { $eq: device } },
      { fields },
    ).terminalDevices;
    return { terminalDevices };
  },
});
