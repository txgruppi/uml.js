var util = require('util');
var _ = require('lodash');

function Interface(name, properties, methods) {
  this.name = name;
  this.methods = methods || [];
}

Interface.prototype.hasMethod = function(method) {
  return _.contains(this.methods, method);
};

module.exports = Interface;
