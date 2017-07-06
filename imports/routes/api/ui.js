import uiSeeds from '/imports/api/ui-seeds.js';
import { check } from 'meteor/check';

//Restivus is a global. See https://github.com/kahmali/meteor-restivus
let Api = new Restivus({
  prettyJson: true,
  apiPath: '/api/ui',
});

Api.addRoute('amputationLevels', {
  get() {
    const amputationLevels = uiSeeds.rawCollection()
      .distinct('amputationLevels')
      .await();
    return { amputationLevels };
  }
});

Api.addRoute('components', {
  get() {
    const amputationLevel = this.queryParams.amputationLevel;
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
    };
    check(amputationLevel, String);
    const components = uiSeeds.find(
      { "amputationLevels.slug": amputationLevel },
      { fields }
    ).fetch();
    return {
      statusCode: 200,
      body: { components },
    }
  }
});

Api.addRoute('measurements', {
  get() {
    const device = this.queryParams.device;
    const fields = {
      _id: false,
      measurements: true
    };
    check(device, String);
    const measurements = uiSeeds.findOne(
      {slug: { $eq: device } },
      { fields }
    ).measurements;
    // console.log(measurements)
    return {
      statusCode: 200,
      body: { measurements },
    }
  }
});


Api.addRoute('terminalDevices', {
  get() {
    const device = this.queryParams.device;
    const fields = {
      _id: false,
      terminalDevices: true
    };
    check(device, String);
    const terminalDevices = uiSeeds.findOne(
      { slug: { $eq: device } },
      { fields }
    ).terminalDevices;
    // console.log(terminalDevices);
    return {
      statusCode: 200,
      body: { terminalDevices },
    }
  }
});
