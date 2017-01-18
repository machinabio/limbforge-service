export const Dashboard = new Mongo.Collection('dashboard');

if (!Dashboard.find({})) {
	Dashboard.insert('response', {foo: 'bar'});
}