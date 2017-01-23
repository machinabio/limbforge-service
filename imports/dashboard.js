export const Dashboard = new Mongo.Collection('dashboard');

if (!Dashboard.findOne({})) {
	Dashboard.insert('response', {foo: 'bar'});
}