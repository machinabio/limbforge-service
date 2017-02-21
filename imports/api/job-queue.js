import Agenda from 'agenda';

const agendaCollectionNAme = 'jobs';
const jobs = new Mongo.Collection(agendaCollectionNAme);
jobs.rawCollection().ensureIndex('nextRunAt', () => {});
jobs.rawCollection().ensureIndex('lockedAt', () => {});
jobs.rawCollection().ensureIndex('name', () => {});
jobs.rawCollection().ensureIndex('priority', () => {});

const Queue = new Agenda({
  mongo: jobs.rawDatabase(),
  db: {
    collection: agendaCollectionNAme
  }
});

Queue.on('ready', () => {
  console.log('Starting Queue');
  Queue.start();
});

Queue.on('error', (error) => {
  console.log('Error starting Queue', error);
});

export default Queue;
