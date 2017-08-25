// Polyfill for Windows JS sandbox
import text_encoding from 'text-encoding';
global.TextDecoder = new text_encoding.TextDecoder();
global.TextEncoder = new text_encoding.TextEncoder();

// Import the adsk libraries
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

// Initialize Fusion360 Microserver
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';
import Agent from '/imports/collections/agents.js';

// Create palette
const adskUI = adsk.core.Application.get().userInterface;
const palettes = adskUI.palettes;
const commandDefs = adskUI.commandDefinitions;
const solidToolbars = adskUI.workspaces.itemById('FusionSolidEnvironment')
  .toolbarPanels;

const Fusion360 = {
  initPalette() {
    // The Agents aren't published until after this module is loaded.
    // TODO refactor to load this module AFTER the subscription is ready
    const agent_id = Agent.findOne({})._id;
    console.log('found agent id ', agent_id);
    const paletteUrl = `http://${Meteor.settings.public.shift
      .url}/palette/${agent_id}`;
    console.log('palette url ', paletteUrl);
    const palette_id = 'shift_palette_id';

    if (palettes.itemById(palette_id) != null)
      palettes.itemById(palette_id).deleteMe();

    const palette = palettes.add(
      palette_id,
      'Fusion360.io',
      paletteUrl,
      true,
      true,
      true,
      400,
      400
    );

    // show shift console command
    const commandID = 'shiftPalette';
    const commandName = 'Shift Console';

    if (commandDefs.itemById(commandID) != null)
      commandDefs.itemById(commandID).deleteMe();

    const commandDefinition = commandDefs.addButtonDefinition(
      commandID,
      commandName,
      '',
      ''
    );

    commandDefinition.commandCreated.add(args => {
      args.command.execute.add(args => {
        palette.isVisible = true;
      });
    });

    // shift panel
    const panelID = 'shiftPanel';
    const panelName = 'Shift';

    if (solidToolbars.itemById(panelID) != null) {
      solidToolbars.itemById(panelID).deleteMe();
    }
    const shiftPanel = solidToolbars.add(panelID, panelName);

    if (shiftPanel.controls.itemById(commandID) != null) {
      shiftPanel.controls.itemById(commandID).deleteMe();
    }

    const toolbarControl = shiftPanel.controls.addCommand(commandDefinition);
    toolbarControl.isVisible = true;
  },
};

// Start the deathknell...
import '/imports/api/deathknell.js';

module.exports = Fusion360;
