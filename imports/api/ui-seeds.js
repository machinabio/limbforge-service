import { Meteor } from 'meteor/meteor';

const uiSeeds = new Mongo.Collection('ui-seeds');

if (uiSeeds.find({})
  .count() == 0) {
  console.warn('Components collection empty, adding seeds.');

  uiSeeds.insert({
    devices: {
      amputationLevels: {
        slug: "transradial",
        name: "Transradial"
      },
      slug: 'xrp-arm',
      name: 'XRP arm',
      icon: 'https://www.AWSurlhere',
      creator: 'limbforge',
      componentType: 'passive',
      weight: '250 g - 350 g',
      description: 'The XRP Arm is a lightweight, highly cosmetic passive device with several terminal device options.',
      tags: ['social occasions', 'supporting objects'],
      printTime: '14 hrs - 20 hrs',
      measurements: [
        {
          name: 'c1',
          step: 0.5,
          upper_range: 28,
          measurement_unit: "cm",
          lower_range: 20,
          default: 25,
          instructions: 'instructions go here',
        },
        ],
      terminalDevices: [
        {
          slug: "active-device",
          name: "Active device"
        }
        ],
    }
  })
};

export default uiSeeds;

