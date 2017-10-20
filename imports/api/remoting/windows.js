import { Meteor } from 'meteor/meteor';
import { powershell } from 'powershell';
const workgangUrl = Meteor.settings.shift.foreman.workgangUrl;
const password = Meteor.settings.shift.foreman.credentials;
const keyfilePath = Meteor.settings.shift.foreman.keyfilePath;

const Workgang = {
  startAgent() {
    powershell(`$keyFilePath = '${keyfilePath}'
$workgangUrl = '${workgangUrl}'
$session = New-PSSession -HostName $workgangUrl -UserName Administrator -KeyFilePath $keyFilePath
$startFusionCommand = [scriptblock]::Create("PsExec.exe -d -i 2 -u Administrator -p '${password}' -w '\Shift' \Shift\FusionLauncher.exe")
Invoke-Command -Session $session -ScriptBlock $startFusionCommand`);
  },
};

module.exports = Workgang;
