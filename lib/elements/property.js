var util = require('util');

function Property(visibility, variable) {
  this.visibility = visibility;
  this.variable = variable;
}

module.exports = Property;
