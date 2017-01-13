export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
	// Ensure any incoming messages are purged after 90 days
	const expiryTime = 60 * 60 * 24 * 90;

	// Ensure any incoming messages are purged after 10 minutes
	const expiryTimeDev = 60 * 10;

    Messages.rawCollection().ensureIndex({ time: 1 }, { expireAfterSeconds: expiryTimeDev });
}
