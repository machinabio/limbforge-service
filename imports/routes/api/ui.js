import uiSeeds from '/imports/api/ui-seeds.js';

//Restivus is a global. See https://github.com/kahmali/meteor-restivus
let Api = new Restivus({
  prettyJson: true
});

Api.addRoute('ui/amputationLevels', {
  get() {
    const amputationLevels = uiSeeds.rawCollection().distinct('amputationLevels').await();
    console.log(amputationLevels);
    return {
      statusCode: 200,
      body: { amputationLevels },
    }
  }
});

