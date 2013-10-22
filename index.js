var json = require('./diagram.json');
var JSONFactory = require('./lib/factories/json');
var GraphvizDot = require('./lib/exporters/graphvizdot');

var doc = (new JSONFactory()).build(json);
var dot = new GraphvizDot(doc);

console.log(dot.export());
