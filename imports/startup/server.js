import './both.js';

import '/imports/publications/publications.js';

import { WebApp } from 'meteor/webapp';

WebApp.rawConnectHandlers.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'localhost');
  return next();
});
