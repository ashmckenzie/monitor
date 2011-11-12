var yaml = require('yaml');
var fs = require('fs');

function load_config(config) {
  return yaml.eval(fs.readFileSync(config).toString());
}

function merge(obj1, obj2) {

  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {

        obj1[p] = merge(obj1[p], obj2[p]);

      } else if ( obj2[p].constructor==Array ) {

        /* I'd like to merge Array's too please */

        obj1[p] = obj2[p].concat(obj1[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
}

exports.load_config = load_config;
exports.merge = merge;