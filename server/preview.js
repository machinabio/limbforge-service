import hash from 'object-hash';
import stringify from 'json-stable-stringify';
import md5 from 'md5';

const quality = 'preview';

//Restivus is a global. See https://github.com/kahmali/meteor-restivus
const Api = new Restivus({
  prettyJson: true
});

Api.addRoute('preview', {
  get() {
    console.log('preview endpoint', this.queryParams);
    let operations = [];
    if (typeof this.queryParams.component === 'object') {
      let components = [...this.queryParams.component];
    } else {
      let components = [this.queryParams.component];
    }
    components.forEach((component) => {
        let parsed = parse_and_normalize(component);
        const id = parsed.id;
        const url = get_hash(parsed);
        delete parsed.id;
        operations.push({id, url, params: parsed});
      });
    let urls = [];

    return operations;
  },
  post() {
    return {
      statusCode: 405,
      body: 'POST method not supported. Try POST instead.'
    };
  }
});

function round_to_half(number) {
  return Math.round(number * 2 / 2).toFixed(1);
}

function parse_and_normalize(stringified_parameters) {
  let cleaned_parameters = JSON.parse(stringified_parameters);
  for (key in cleaned_parameters) {
    if (isNaN(parseFloat(cleaned_parameters[key]))) {
      cleaned_parameters.id = String(cleaned_parameters.id);
    } else {
      cleaned_parameters[key] = round_to_half(cleaned_parameters[key]);
    }
  }
  return cleaned_parameters;
}

function get_hash(parameters) {
  return md5(stringify({...parameters, quality}));
}
