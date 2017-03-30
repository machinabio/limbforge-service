import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson'
import { check } from 'meteor/check';
import { Random } from 'meteor/random';

import hasha from 'hasha';
import knox from 'knox';
import request from 'request';
import archiver from 'archiver';
import Fiber from 'fibers';

const quality = 'preview';
const settings = Meteor.settings.storage;
const storage_client = knox.createClient({
  key: settings.accessKeyId,
  secret: settings.secretAccessKey,
  bucket: settings.bucket
});

//Restivus is a global. See https://github.com/kahmali/meteor-restivus
const Api = new Restivus({
  prettyJson: true,
  apiPath: '/limbforge'
});

Api.addRoute('preview', {
  get() {
    console.log('*** preview endpoint', this.queryParams);
    let operations = [];
    let components;
    try {
      if (typeof this.queryParams.component === 'object') {
        console.log('*** found an array of components');
        components = [...this.queryParams.component];
      } else {
        console.log('*** found a single component');
        components = [this.queryParams.component];
      }
      components.forEach((component) => {
        let parsed = parse_and_normalize(component);
        const id = parsed.id;
        const cache_id = get_hash(parsed);
        delete parsed.id;
        operations.push({ id, cache_id, parameters: parsed });
      });
      // console.log('ops: ', operations)
      let archive = archiver('zip');
      operations.forEach((operation) => {
        const name = Random.id(4);
        console.log(`*** using "${name}" as the name for component ${operation.id}`);
        archive.append(get_STL(operation), { name });
      });
      var fiber = Fiber.current;

      archive.on('end', () => {
        console.log('on end!');
        this.response.write('foo');
        fiber.run();

      });
      this.response.writeHead(200, {
        'Content-Type': 'application/zip'
      });
      Fiber.yield();
      this.done();

    } catch (error) {
      console.error(error);
      return {
        statusCode: 400,
        body: error
      }
    }

    return operations;
  },
  post() {
    return {
      statusCode: 405,
      body: 'POST method not supported. Try GET instead?'
    };
  }
});

function round_to_half(number) {
  return Math.round(number * 2 / 2).toFixed(1);
}

function parse_and_normalize(stringified_parameters) {
  // console.log("s: ", stringified_parameters);
  let cleaned_parameters = EJSON.parse(stringified_parameters);
  // console.log("p: ", cleaned_parameters)
  for (key in cleaned_parameters) {
    // console.log(' k: ', key)
    if (isNaN(parseFloat(cleaned_parameters[key])) || key === 'id') {
      // console.log(" s:", cleaned_parameters[key]);
      cleaned_parameters.id = String(cleaned_parameters.id);
    } else {
      // console.log(" n:", cleaned_parameters[key]);
      cleaned_parameters[key] = round_to_half(cleaned_parameters[key]);
    }
  }

  return cleaned_parameters;
}

function get_hash(parameters) {
  let object_string = EJSON.stringify({...parameters, quality }, { cannonical: true });
  return hasha(object_string, { algorithm: "sha512" });
}

//TODO Clean up the commented code. Here just for short-term reference 
function get_STL({ id, cache_id, parameters }) {
  console.log(`ID: ${id}, cache_id? ${cache_id}`);
  // storage_client.headFile(cache_id, (error, response) => {
  //   console.log('results: ', response.statusCode);
  //   if (response.statusCode === 200) {
  //     console.log('--success!');
  //     // return HTTP.
  //   } else {
  //     console.log('--failure!');
  //   }
  // });

  const response = Meteor.wrapAsync(storage_client.headFile, storage_client)(cache_id);
  const cached = (response.statusCode === 200);
  if (cached) {
    const url = storage_client.https(cache_id);
    console.log(`// already cached at ${url}`);
    return request
      .get(url)
      .on('response', function(response) {
        console.log(`// response code ${response.statusCode}`); // 200 
        console.log(`// content type ${response.headers['content-type']}`);
        console.log(`// content length ${response.headers['content-length']}`);
        // console.log(response);
      })
  }
  const data = { cache_id, parameters };
  const url = `http://localhost:3000/api/rex/${id}`
  console.log(`// generating part ID ${id}, passing parameters ${EJSON.stringify(data)} to ${url}`);
  return request
    .post(url)
    .json(data)
    .on('response', function(response) {
      console.log(`// response code ${response.statusCode}`); // 200 
      console.log(`// content type ${response.headers['content-type']}`);
      console.log(`// content length ${response.headers['content-length']}`);
      // console.log(response);
    })

  // console.log('results: ', cached.statusCode);
}
