export const Messages = new Mongo.Collection('dashboard');

if (!Messages.find({})) {
	Messages.insert('response', {foo: 'bar'});
}