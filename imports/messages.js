export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
    Messages._ensureIndex({ time: 1 }, { expireAfterSeconds: 10 });
}
