var util = require('util');
var _ = require('lodash');

function Class(name, properties, methods) {
  this.name = name;
  this.properties = properties || [];
  this.methods = methods || [];
}

Class.prototype.hasProperty = function(property) {
  return _.contains(this.properties, property);
};

Class.prototype.hasMethod = function(method) {
  return _.contains(this.methods, method);
};

module.exports = Class;
