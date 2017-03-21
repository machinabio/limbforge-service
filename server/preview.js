// import hash from 'object-hash';
// import stringify from 'json-stable-stringify';
import hasha from 'hasha';
import { EJSON } from 'meteor/ejson'

const quality = 'preview';

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
        operations.push({ id, cache_id, params: parsed });
      });
    }
    catch (error) {
      return {
        statusCode: 400,
        body: 'Can\'t parse query'
      }
    }
    let urls = [];

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
  let object_string = EJSON.stringify({...parameters, quality }, {cannonical: true});
  return hasha(object_string, {algorithm: "sha512"});
}

