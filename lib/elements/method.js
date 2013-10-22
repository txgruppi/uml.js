var util = require('util');
var _ = require('lodash');
var Property = require('./property');

function Method(visibility, variable, args) {
  Method.super_.call(this, visibility, variable);
  this.arguments = args || [];
}

util.inherits(Method, Property);

Method.prototype.hasArgument = function(argument) {
  return _.contains(this.links, argument);
};

module.exports = Method;
