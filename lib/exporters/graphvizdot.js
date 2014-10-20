var util = require('util');
var _ = require('lodash');

var Link = require('../elements/link');

function GraphvizDot(document) {
  this.document = document;
}

GraphvizDot.prototype._document = function(document) {
  return util.format('digraph %s{%s}', document.name || 'Document', this._diagram(document.diagram));
};

GraphvizDot.prototype._diagram = function(diagram) {
  switch (diagram.constructor.name) {
    case 'ClassDiagram':
      return this._classDiagram(diagram);
      break;
  }
  return null;
};

GraphvizDot.prototype._classDiagram = function(diagram) {
  return util.format('bgcolor="transparent";node [shape="record",fontname="UbuntuMono-Regular",fontsize="11",style="filled",fillcolor="#ffffff"];edge [arrowhead="none",arrowtail="none",fontname="Ubuntu Mono",fontsize="11"];%s%s', this._classes(diagram.classes), this._links(diagram.links));
};

GraphvizDot.prototype._links = function(links) {
  return _.map(links, this._link.bind(this)).join('');
};

GraphvizDot.prototype._link = function(link) {
  var fmt = null;

  switch (link.type) {
    case Link.ASSOCIATION:
      fmt = '"%s"->"%s"[label="%s",headlabel="%s",taillabel="%s"];';
      break;

    case Link.DIRECT_ASSOCIATION:
      fmt = '"%s"->"%s"[dir="both",arrowtail="normal",label="%s",headlabel="%s",taillabel="%s"];';
      break;

    case Link.AGGREGATION:
      fmt = '"%s"->"%s"[dir="both",arrowtail="odiamond",label="%s",headlabel="%s",taillabel="%s"];';
      break;

    case Link.COMPOSITION:
      fmt = '"%s"->"%s"[dir="both",arrowtail="diamond",label="%s",headlabel="%s",taillabel="%s"];';
      break;

    case Link.GENERALIZATION:
      fmt = '"%s"->"%s"[dir="both",arrowtail="onormal",label="%s",headlabel="%s",taillabel="%s"];';
      break;

    case Link.REALIZATION:
      fmt = '"%s"->"%s"[dir="both",arrowtail="onormal",style="dotted",label="%s",headlabel="%s",taillabel="%s"];';
      break;

    case Link.IMPLEMENTATION:
      fmt = '"%s"->"%s"[style="dashed",arrowtail="empty",dir="both",label="%s",headlabel="%s",taillabel="%s"];';
      break;
  }

  return fmt ? util.format(fmt, link.first.name, link.second.name, link.description, link.head_description, link.tail_description) : null;
};

GraphvizDot.prototype._classes = function(classes) {
  return _.map(classes, this._class.bind(this)).join('');
};

GraphvizDot.prototype._class = function(c) {
  return util.format('"%s"[label="{%s%s%s}";];', c.name, c.name, this._properties(c.properties), this._methods(c.methods));
};

GraphvizDot.prototype._properties = function(properties) {
  var result = _.map(properties, this._property.bind(this)).join('');
  return result.length > 0 ? ('|'+result) : result;
}

GraphvizDot.prototype._property = function(property) {
  return util.format('%s %s \\l', property.visibility, this._variable(property.variable));
};

GraphvizDot.prototype._methods = function(methods) {
  var result = _.map(methods, this._method.bind(this)).join('');
  return result.length > 0 ? ('|'+result) : result;
}

GraphvizDot.prototype._method = function(method) {
  if (method.variable.type) {
    return util.format('%s %s(%s) : %s\\l', method.visibility, method.variable.name, this._arguments(method.arguments), method.variable.type);
  } else {
    return util.format('%s %s(%s)\\l', method.visibility, method.variable.name, this._arguments(method.arguments));
  }
};

GraphvizDot.prototype._arguments = function(args) {
  return _.map(args, this._variable.bind(this)).join(', ');
};

GraphvizDot.prototype._variable = function(variable) {
  return util.format('%s : %s', variable.name, variable.type);
};

GraphvizDot.prototype.export = function() {
  return this._document(this.document);
};

module.exports = GraphvizDot;
