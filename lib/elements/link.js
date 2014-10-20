function Link(type, first, second, description, head_description, tail_description) {
  this.type = type;
  this.first = first;
  this.second = second;
  this.description = description || '';
  this.head_description = head_description || '';
  this.tail_description = tail_description || '';
}

Link.ASSOCIATION = 'association';
Link.DIRECT_ASSOCIATION = 'direct_association';
Link.AGGREGATION = 'aggregation';
Link.COMPOSITION = 'composition';
Link.GENERALIZATION = 'generalization';
Link.REALIZATION = 'realization';
Link.IMPLEMENTATION = 'implementation';

Link.prototype.toJSON = function() {
  return {
    type: this.type,
    first: this.first.name,
    second: this.second.name,
    description: this.description,
    head_description: this.head_description,
    tail_description: this.tail_description,
  };
};

module.exports = Link;
