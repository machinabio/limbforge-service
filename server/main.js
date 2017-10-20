import '/imports/startup/server.js';
import '/imports/routes/server.js';

if (process.env.NODE_ENV === 'development') {
  METEORTOYSSHELL = true;
}
