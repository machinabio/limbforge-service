import Agenda from 'agenda';

const agendaCollectionNAme = 'jobs';
const jobs = new Mongo.Collection(agendaCollectionNAme);
jobs.rawCollection().ensureIndex('nextRunAt', () => {});
jobs.rawCollection().ensureIndex('lockedAt', () => {});
jobs.rawCollection().ensureIndex('name', () => {});
jobs.rawCollection().ensureIndex('priority', () => {});

export const Queue = new Agenda({
  mongo: jobs.rawDatabase(),
  db: {
    collection: agendaCollectionNAme
  }
});

