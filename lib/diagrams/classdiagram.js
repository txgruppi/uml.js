var _ = require('lodash');

function ClassDiagram(classes, links) {
  this.type = 'ClassDiagram';
  this.classes = classes || [];
  this.links = links || [];
}

ClassDiagram.prototype.hasClass = function(c) {
  return _.contains(this.classes, c);
};

ClassDiagram.prototype.hasLink = function(link) {
  return _.contains(this.links, link);
};

module.exports = ClassDiagram;
