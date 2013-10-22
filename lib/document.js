function Document(diagram) {
  if (this.constructor != Document) {
    return new Document(diagram);
  }
  this.diagram = diagram;
}

module.exports = Document;
