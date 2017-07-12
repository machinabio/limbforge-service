import './core/application.js';
import './core/dashboard.js';
import './core/geometry.js';
import './core/materials.js';
import './core/userInterface.js';
import '/imports/api/fusion360js/utilities.js';
import './Fusion/bRep.js';
import './Fusion/components.js';
import './Fusion/construction.js';
import './Fusion/features.js';
import './Fusion/fusion.js';
import './Fusion/meshBody.js';
import './Fusion/meshData.js';
import './Fusion/sketch.js';
import './Fusion/tSpline.js';
import './CAM/operations.js';
import './CAM/cam.js';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';

import Agent from '/imports/collections/agents.js';

var palettes = adsk.core.Application.get().userInterface.palettes;

var palette_id = 'shift_palette_id';
var old_palette = palettes.itemById(palette_id);
if (old_palette != null) old_palette.deleteMe();

Meteor.call("printLog", "...building palette");
console.log('...building palette');

Meteor.setTimeout(() => {
  var agent_id = Session.get('agentId');
  console.log('found agent id ', agent_id);
  // var agent = Agent.findOne(agent_id);

  var paletteUrl = `http://${Meteor.settings.public.shift.url}/palette/${agent_id}`
  console.log(`Calling palette enpoint at ${paletteUrl}`);
  var palette = palettes.add(palette_id, 'Fusion360.io', paletteUrl, true, true, true, 400, 400);
},5000);
