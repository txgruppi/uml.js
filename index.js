if (module && require && require.main == module) {
  var json = require('./diagram.json');
  var JSONFactory = require('./lib/factories/JSONFactory');
  var GraphvizDot = require('./lib/exporters/GraphvizDot');

  var doc = (new JSONFactory()).build(json);
  var dot = new GraphvizDot(doc);

  console.log(dot.export());
} else {
  exports.Document = require('./lib/Document');
  exports.ClassDiagram = require('./lib/diagrams/ClassDiagram');
  exports.Class = require('./lib/elements/Class');
  exports.Property = require('./lib/elements/Property');
  exports.Method = require('./lib/elements/Method');
  exports.Link = require('./lib/elements/Link');
  exports.GraphvizDot = require('./lib/exporters/GraphvizDot');
  exports.JSONFactory = require('./lib/factories/JSONFactory');
  exports.Variable = require('./lib/elements/Variable');
  exports.Visibility = require('./lib/shared/visibility');
}
