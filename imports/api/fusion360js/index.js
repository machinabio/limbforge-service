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

import Agent from '/imports/collections/agents.js';
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';

const palette_id = 'shift_palette_id';

Meteor.call("printLog", "...building palette");
console.log('...building palette');

var agent = Agent.findOne(Session.get('agentId'));


var palettes = adsk.core.Application.get().userInterface.palettes;
var old_palette = palettes.itemById(palette_id);
var agent_id = Session.get('agentId');

if (old_palette != null) old_palette.deleteMe();
var palette = palettes.add(palette_id, 'Fusion360.io', `http://fusion360.io/palette/${agent_id}`, true, true, true, 400, 400)

