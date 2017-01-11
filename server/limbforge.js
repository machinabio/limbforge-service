/*************************************************************
Right now we're building URLs and downloading static content from S3

We want to use Fusion360 to generate the STLs dynamically!


----- Handler
1. Check to see if there's any available Fusion workers.If not, return server busy(?)
2. Pass the request to a Fusion worker
-----

--- Fusion Worker
FWorkers(numWorkers) - constructor.
   1. Creates <numWorkers> of hardlinks to Fusion360.
   (2). Create a new hardlink to Fusion360 called UUID (npm module lnk)
(3). Register that hardlink to Fusion360 as the helper for fusion360 events (npm module windows-registry)

FWorkers.anyIdle() - true/false
FWorkers.employ() - 

backed by a collection - 1 record per instance


--- 


0. The handler for the '/api/:tenant/:service' endpoint receives the request
1. The handler makes relevant parameters available at '/request/:UUID' (restivus collection API?)
4. The handler calls openurl('fusion360://command=open&file=/<UUID>-<WORKER>.f3d')
---this------ ()
5. The python bridge retrieves the parameters from the endpoint and saves
   the paremeters (including the UUID) to the temp directory in a text file as JSON.
6. The python bridge retrieves and executes the appropriate CommandDefinition
7. The javascript script loads the params from the text files, updates the 
   CAD parameters and sends the STL to an '/response/:UUID' endpoint
--- or ------ 
5. multiple Python workers (1 for each design) inside Fusion360 respond to the
   file opening event. Each checks the <WORKER> specified in the filename and
   only the appropriate worker continues processing the request.
6. the appropriate worker adjusts the design parameters, and sends the STL to
   an '/response/:UUID' endpoint
---end-----
8. The handler for the '/response/:UUID' endpoint passes that data back to orignal
   handler
9. The handler processes the data accordingly and finalizes the orignal response
*************************************************************/

// const baseUrl = 'https://fusion360.io/limbforge';
const baseUrl = 'https://s3.amazonaws.com/limbforgestls';

function fetchXradial(params) {
  var url = [];
  url.push(baseUrl);
  url.push('forearm/ebearm');
  url.push(params.orientation)
  url.push(forearmFilename)
  url = url.join('/')

  var forearmFilename = [];
  forearmFilename.push('forearm_ebearm_');
  forearmFilename.push(params.orientation)
  forearmFilename.push('_C4-')
  forearmFilename.push(params.C4);
  forearmFilename.push('_L1-')
  forearmFilename.push(params.L1)
  forearmFilename.push('.stl');
  forearmFilename = forearmFilename.join('')

  console.log('Generated forearm URL is ' + url);

  var request = HTTP.get(url);

  return 'some data';
}

function fetchXhumeral(params) {

}

function fetchTerminalDevice(params) {
  var terminalFilename = [];
  terminalFilename.push('td_');
  terminalFilename.push(params.TD)
  terminalFilename.push('_')
  terminalFilename.push(params.orientation);
  terminalFilename.push('.stl');
  terminalFilename = terminalFilename.join('')

  var url = [];
  url.push(baseUrl);
  url.push('td');
  url.push(params.orientation)
  url.push(terminalFilename)
  url = url.join('/')

  console.log('Generated TD URL is ' + url);

  var request = HTTP.get(url);

  return 'some data';
}

function fetchWristAdaptor(params) {
  var url = [];
  url.push(baseUrl);
  url.push('EbeArm');
  url.push('EbeArm_wrist_unit+v1.stl')
  url = url.join('/')

  console.log('Generated wrist URL is ' + url);

  var request = HTTP.get(url);

  return 'some data';
}

function xradialArchive(params) {
  // call all 3 
  var response = {
    statusCode: 200,
    headers: {
      'Content-Disposition': 'attachment; filename=' + forearmFilename,
      'Content-Type': 'application/vnd.ms-pkistl',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'x-requested-with'
    },
    body: 'request.content'
  };

  return response;
}