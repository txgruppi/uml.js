var util = require('util');
var _ = require('lodash');

var Document = require('../document');

var ClassDiagram = require('../diagrams/classdiagram');

var Class = require('../elements/class');
var Property = require('../elements/property');
var Method = require('../elements/Method');
var Link = require('../elements/link');
var Variable = require('../elements/variable');

function JSONFactory() {
  this.refs = {};
  this.classes = {};

  var resolver = _.compose(JSON.stringify, _.identity);
  this.buildDocument = _.memoize(this.buildDocument, resolver);
  this.buildDiagram = _.memoize(this.buildDiagram, resolver);
  this.buildProperty = _.memoize(this.buildProperty, resolver);
  this.buildMethod = _.memoize(this.buildMethod, resolver);
  this.buildVariable = _.memoize(this.buildVariable, resolver);
  this.buildLink = _.memoize(this.buildLink, resolver);
  this.buildClass = _.memoize(this.buildClass, resolver);
}

JSONFactory.prototype.addClass = function(name, object) {
  if (this.classes[name]) {
    throw util.format("Class %s already defined.", name);
  }
  this.classes[name] = object;
};

JSONFactory.prototype.getClass = function(name) {
  return this.classes[name];
};

JSONFactory.prototype.buildDocument = function(data) {
  return new Document(this.buildDiagram(data.diagram || null));
}

JSONFactory.prototype.buildDiagram = function(data) {
  return new ClassDiagram(this.buildClasses(data.classes || []), this.buildLinks(data.links || []));
}

JSONFactory.prototype.buildClasses = function(data) {
  return _.map(data, this.buildClass.bind(this));
}

JSONFactory.prototype.buildClass = function(data) {
  var c = new Class(data.name, this.buildProperties(data.properties), this.buildMethods(data.methods));
  this.addClass(c.name, c);
  return c;
}

JSONFactory.prototype.buildProperties = function(data) {
  return _.map(data, this.buildProperty.bind(this));
}

JSONFactory.prototype.buildProperty = function(data) {
  return new Property(data.visibility, this.buildVariable(data.variable));
}

JSONFactory.prototype.buildMethods = function(data) {
  return _.map(data, this.buildMethod.bind(this));
}

JSONFactory.prototype.buildMethod = function(data) {
  return new Method(data.visibility, this.buildVariable(data.variable), this.buildArguments(data.arguments));
}

JSONFactory.prototype.buildArguments = function(data) {
  return _.map(data, this.buildVariable.bind(this));
}

JSONFactory.prototype.buildVariable = function(data) {
  return new Variable(data.name, data.type);
}

JSONFactory.prototype.buildLinks = function(data) {
  return _.map(data, this.buildLink.bind(this));
}

JSONFactory.prototype.buildLink = function(data) {
  return new Link(data.type, this.getClass(data.first), this.getClass(data.second), data.description, data.head_description, data.tail_description);
}

JSONFactory.prototype.build = JSONFactory.prototype.buildDocument;

module.exports = JSONFactory;
