if (module && require && require.main == module) {
  var json = require('./diagram.json');
  var JSONFactory = require('./lib/factories/json');
  var GraphvizDot = require('./lib/exporters/graphvizdot');

  var doc = (new JSONFactory()).build(json);
  var dot = new GraphvizDot(doc);

  console.log(dot.export());
} else {
  exports.Document = require('./lib/document');
  exports.ClassDiagram = require('./lib/diagrams/classdiagram');
  exports.Class = require('./lib/elements/class');
  exports.Property = require('./lib/elements/property');
  exports.Method = require('./lib/elements/method');
  exports.Link = require('./lib/elements/link');
  exports.GraphvizDot = require('./lib/exporters/graphvizdot');
  exports.JSONFactory = require('./lib/factories/json');
  exports.Variable = require('./lib/elements/variable');
  exports.Visibility = require('./lib/shared/visibility');
}
