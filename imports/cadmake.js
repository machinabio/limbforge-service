 export const CadMake = new Mongo.Collection('cadmake');

 if (!CadMake.findOne({}) && Meteor.isServer) {
   console.log('Adding record to cadMake');
   var record = {};
   record.script = "adsk.core.Application.get().userInterface.messageBox('FATHOM CadMake microserver -- running inside fusion.');";
   record._id = 'limbforge';
   CadMake.insert(record); 
 }
