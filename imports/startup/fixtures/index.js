{
  "name": "Open Design from Data Hub”,
  "code": "var app = adsk.core.Application.get();\nvar ui = app.userInterface;\nvar data = app.data;\nvar design = app.activeDocument.design;\nvar docs = app.documents;\nvar hubs = data.dataHubs;\n\nvar pHub = hubs.item(0); // found through trial and error.\n//TODO write a method to find hub by name\n\nvar lfProj = pHub.dataProjects.item(7); // found through trial and error\n//TODO write a method to find project by name\n\nvar lfRoot = lfProj.rootFolder;\nvar workingFolder = lfRoot.dataFolders.itemByName('microservice');\nvar files = workingFolder.dataFiles;\n\nvar testFile = files.item(2); // found through trial and error\n//TODO write a method to find file by name\n\ndocs.open(testFile);\n\n"
}

{
  "name": "Install Command and Toolbar",
  "code": "var app = adsk.core.Application.get();\nvar ui = app.userInterface;\nvar commandDefs = ui.commandDefinitions;\n\nvar panelID = \"shiftPanel\";\nvar panelName = 'Shift';\nvar commandID = 'bodyProps';\nvar commandName = 'Body Properties';\n\nvar solidWorkspace = ui.workspaces.itemById(\"FusionSolidEnvironment\");\nvar solidToolbars = solidWorkspace.toolbarPanels;\n//ui.messageBox(\"Panel count \"+solidToolbars.count);\n\n/////////////////////////////////////////////////\n// CommandCreated handler\nvar onCreated = function(args) {\n  var command = args.command;\n  command.execute.add(onExcuted);\n};\n\n/////////////////////////////////////////////////\n// CommandExecuted handler\nvar onExcuted = function(args) {\n  // ui.messageBox(\"BodyProps command executed\");\n  var selections = ui.activeSelections;\n  for (var iter = 0; iter < selections.count; iter++) {\n  var selection = selections.item(iter).entity;\n  var convexEdges = selection.convexEdges.count;\n  var concaveEdges = selection.concaveEdges.count;\n  var edges = selection.edges.count;\n  var faces = selection.faces.count;\n  var volume = selection.volume;\n  var area = selection.area;\n  var vertices = selection.vertices.count;\n  var name = selection.name;\n  \n  var test = 'Name: '+name+'\\n';\n  // test += 'convexEdges: '+convexEdges+'\\n';\n  // test += 'concaveEdges: '+concaveEdges+'\\n';\n  test += 'edges: '+edges+'\\n';\n  test += 'faces: '+faces+'\\n';\n  test += 'volume: '+volume+'\\n';\n  test += 'area: '+area+'\\n';\n  test += 'vertices: '+vertices+'\\n';\n  ui.messageBox(test);\n}\n\n};\n\n// Create CommandDefintion\nvar commandDefinition = commandDefs.itemById(commandID)\nif (commandDefinition) {\n  //ui.messageBox(\"Found command \"+commandDefinition.id);\n  commandDefinition.deleteMe();\n}\ncommandDefinition = commandDefs.addButtonDefinition(commandID, commandName, '', '');\ncommandDefinition.commandCreated.add(onCreated);\n\n// Get SHIFT panel\nvar shiftPanel = solidToolbars.itemById(panelID);\nif (shiftPanel) {\n  //ui.messageBox(\"Found panel \"+shiftPanel.id);\n  shiftPanel.deleteMe();\n  //ui.messageBox(\"Panel count \"+solidToolbars.count);\n}\nshiftPanel = solidToolbars.add(panelID, panelName);\n\n// Add to SHIFT panel\nvar toolbarControl = shiftPanel.controls.itemById(commandID)\nif (toolbarControl) {\n  toolbarControl.deleteMe()\n}\ntoolbarControl = shiftPanel.controls.addCommand(commandDefinition)  \ntoolbarControl.isVisible = true;\n\n//ui.messageBox(\"done\");",
  "parameters": ""
}

{
  "name": "Remove Command and Toolbar",
  "code": "var app = adsk.core.Application.get();\nvar ui = app.userInterface;\nvar commandDefs = ui.commandDefinitions;\n\nvar panelID = \"shiftPanel\";\nvar panelName = 'Shift';\nvar commandID = 'bodyProps';\nvar commandName = 'Body Properties';\n\nvar solidWorkspace = ui.workspaces.itemById(\"FusionSolidEnvironment\");\nvar solidToolbars = solidWorkspace.toolbarPanels;\n\n// Get SHIFT panel\nvar shiftPanel = solidToolbars.itemById(panelID);\nif (shiftPanel) {\n  shiftPanel.deleteMe();\n}"
}

{
  "name": "Hello World",
  "code": "var app = adsk.core.Application.get();\nvar ui = app.userInterface;\nui.messageBox(\"Go FATHOM\");\n\n\n"
}

{
  "name": "Hello World (API)",
  "code": "var app = adsk.core.Application.get();\nvar ui = app.userInterface;\nui.messageBox(Shift.data.message);\n\nShift.response = \"snap!\";\n",
  "published": true,
  "_md5": "e83cdb9faf6680f4e57ad2a4cf45308d",
  "parameters": "{\n  \"message\": \"Hi from Shift!\"\n}"
}

{
  "name": "Query selected body properties",
  "code": "var app = adsk.core.Application.get();\nvar ui = app.userInterface;\nvar selections = ui.activeSelections;\n\nfor (var iter = 0; iter < selections.count; iter++) {\n  var selection = selections.item(iter).entity;\n  var convexEdges = selection.convexEdges.count;\n  var concaveEdges = selection.concaveEdges.count;\n  var edges = selection.edges.count;\n  var faces = selection.faces.count;\n  var volume = selection.volume;\n  var area = selection.area;\n  var vertices = selection.vertices.count;\n  var name = selection.name;\n  \n  var test = 'Name: '+name+'\\n';\n  // test += 'convexEdges: '+convexEdges+'\\n';\n  // test += 'concaveEdges: '+concaveEdges+'\\n';\n  test += 'edges: '+edges+'\\n';\n  test += 'faces: '+faces+'\\n';\n  test += 'volume: '+volume+'\\n';\n  test += 'area: '+area+'\\n';\n  test += 'vertices: '+vertices+'\\n';\n  ui.messageBox(test);\n}\n\n"
}

{
  "name": "Change Parameter",
  "code": "\nvar params = design.allParameters;\nvar length = params.itemByName('length');\nvar filet = params.itemByName('filet');\n\nlength.value = 15\n\n// ui.messageBox('parameter '+length.name);\n\n"
}