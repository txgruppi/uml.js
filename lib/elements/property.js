var util = require('util');

function Property(visibility, variable) {
  if (this.constructor != Property) {
    return new Property(visibility, variable);
  }
  this.visibility = visibility;
  this.variable = variable;
}

module.exports = Property;
