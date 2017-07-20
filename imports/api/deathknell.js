HumInt = require('human-interval');

var maxIdleTime = HumInt(Meteor.settings.public.shift.maxIdleTime);
var maxExecTime = HumInt(Meteor.settings.public.shift.maxExecTime);
var maxInitTime = HumInt(Meteor.settings.public.shift.maxInitTime);
var maxRings = Meteor.settings.public.shift.maxJobs;

var idleTO = true;
var executionTO = false;
var initialiaztionTO = true;
var ringLimit = false;

var starttime = Date.now();
var rings = 0;

var Deathknell = {
    ring: function() {
        console.log('DEATHKNELL ring called after ' + (Date.now() - starttime) + ' ms');
        Meteor.call("printLog", 'DEATHKNELL ring called after ' + String(Date.now() - starttime) + ' ms');

        Meteor.clearTimeout(timeoutHandle);
        idleTO = false;

        timeoutHandle = Meteor.setTimeout(expireDeathknell, maxExecTime);
        executionTO = true;

        rings++;
    },

    finish: function() {
        console.log('DEATHKNELL finish called after ' + (Date.now() - starttime) + ' ms');
        Meteor.call("printLog", 'DEATHKNELL finish called after ' + String(Date.now() - starttime) + ' ms');

        Meteor.clearTimeout(timeoutHandle);
        executionTO = false;

        if (rings >= maxRings) expire();

        timeoutHandle = Meteor.setTimeout(expireDeathknell, maxIdleTime);
        idleTO = true;
    },

    initialize: function() {
        console.log('DEATHKNELL initialize called after ' + (Date.now() - starttime) + ' ms');
        Meteor.call("printLog", 'DEATHKNELL initialize called after ' + String(Date.now() - starttime) + ' ms');

        Meteor.clearTimeout(timeoutInitHandle);
        initialiaztionTO = false;

        this.initialize = () => { return };
    }
}

var timeoutHandle = Meteor.setTimeout(expireDeathknell, maxIdleTime);
var timeoutInitHandle = Meteor.setTimeout(restartMicroserver, maxInitTime);

global.Deathknell = Deathknell;

module.exports = Deathknell;

// This functions are hoisted
function expireDeathknell() {
    console.error('DEATHKNELL');

    console.error('Shutting down after ' + (Date.now() - starttime) + ' milliseconds');
    console.error('... after ' + rings + ' of ' + maxRings + ' rings');
    if (initialiaztionTO) console.error('### Exceeded max initialization time of ' + maxInitTime + ' ms');
    if (idleTO) console.error('### Exceeded max idle lifetime of ' + maxIdleTime + ' ms');
    if (executionTO) console.error('### Exceeded max execution time of ' + maxExecTime + ' ms');

    Meteor.call("printLog", 'Shutting down after ' + (Date.now() - starttime) + ' milliseconds');
    Meteor.call("printLog", '... after ' + rings + ' of ' + maxRings + ' rings');
    if (initialiaztionTO) Meteor.call("printLog", '### Exceeded max initialization time of ' + maxInitTime + ' ms');
    if (idleTO) Meteor.call("printLog", '### Exceeded max idle lifetime of ' + maxIdleTime + ' ms');
    if (executionTO) Meteor.call("printLog", '### Exceeded max execution time of ' + maxExecTime + ' ms');

    // close all open docs
    var app = adsk.core.Application.get();
    var ui = app.userInterface;
    var docs = app.documents;

    var openDocs = Number(docs.count); // store copy, not reference
    for (var index = 0; index < openDocs; index++) {
        var doc = docs.item(index);
        doc.close(false); // suppress save changes warnings
    }

    // might need to do some Meteor cleanup here?

    // exit the application
    if (initialiaztionTO) {
        window.location.reload();
    } else {
        var exitCmdDef = ui.commandDefinitions.itemById('ExitApplicationCommand');
        exitCmdDef.execute();
        window.location.reload();
    }

    console.error('Goodbye');
}

function restartMicroserver() {

}
