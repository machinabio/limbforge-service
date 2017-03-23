import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson'
import { check } from 'meteor/check';

import hasha from 'hasha';
import knox from 'knox';

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
    console.log('preview endpoint', this.queryParams);
    let operations = [];
    let components;
    try {
      if (typeof this.queryParams.component === 'object') {
        console.log('array');
        components = [...this.queryParams.component];
      } else {
        console.log('single');
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
      operations.forEach(get_STL);

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
    if (isNaN(parseFloat(cleaned_parameters[key]))) {
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

  const status = Meteor.wrapAsync(storage_client.headFile, storage_client)(cache_id);
  const cached = (status === 200);
  let request;
  if (cached) {
    return request
      .get(storage_client.https(cache_id))
      .on('response', function(response) {
        console.log(response.statusCode) // 200 
        console.log(response.headers['content-type']) // 'image/png' 
      })
  } else {
    // enqueu
  }
  console.log(`ID: ${id}, status? ${status.statusCode}`);
  i
  return status;
  // console.log('results: ', cached.statusCode);
}

