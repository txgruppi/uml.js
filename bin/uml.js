#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var jison = require('jison');

var languagesPath = path.join(__dirname, '..', 'languages');

function compile(parser, content) {
  var JSONFactory = require('../lib/factories/json');
  var doc = (new JSONFactory()).build(parser.parse(content));

  if (process.argv[4] === 'json') {
    console.log(JSON.stringify(doc));
  } else {
    var GraphvizDot = require('../lib/exporters/graphvizdot');
    var dot = new GraphvizDot(doc);
    console.log(dot.export());
  }
}

fs.readFile(path.join(languagesPath, process.argv[2] + '.jison'), 'utf8', function(err, grammar){
  if (err) { throw err; }
  var parser = new jison.Parser(grammar);
  if (process.argv[3] == '-') {
    var content = '';
    process.stdin.on('data', function(c){content+=c.toString();});
    process.stdin.on('end', function(){
      compile(parser, content)
    });
  } else {
    fs.readFile(process.argv[3], 'utf8', function(err, content){
      if (err) { throw err; }
      compile(parser, content);
    });
  }
});
