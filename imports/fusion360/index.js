console.log('Loading Fusion360 plugin');
import './api';

"use strict";
if (adsk.debug === true) {
  /*jslint debug: true*/
  debugger;
  /*jslint debug: false*/
}

var ui;

try {
  var app = adsk.core.Application.get();
  var ui = app.userInterface;
  // var dataFile = app.activeDocument.dataFile;
  // var design = app.activeDocument.design;
  // var startTime = Date.now();

  // var data = countTimelineFromDesign(design);
  // var data = countTimelineFromFile(dataFile);
  // var totalTime = (Date.now() - startTime) / 1000;

  // ui.messageBox('Total timeline count : ' + data.count + '\n' +
  //   'Number of children : ' + data.children + '\n' +
  //   'Took : ' + totalTime + ' s');

  ui.messageBox('Meteor running inside fusion! RELOADING!!!');

} catch (e) {
  if (ui) {
    ui.messageBox('Failed : ' + (e.description ? e.description : e));
  }
}

// adsk.terminate();
