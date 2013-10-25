#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var languages_path = path.join(__dirname, '..', 'languages');

function toDot(language, content) {
  var JSONFactory = require('../lib/factories/json');
  var GraphvizDot = require('../lib/exporters/graphvizdot');

  var doc = (new JSONFactory()).build(language.parse(content));
  var dot = new GraphvizDot(doc);

  console.log(dot.export());
}

fs.readdir(languages_path, function(err, list){
  if (err) { throw err; }
  var language = process.argv[2];
  if (list.indexOf(language) != -1) {
    var language = require(path.join(languages_path, language, language));
    if (process.argv[3] == '-') {
      var content = '';
      process.stdin.on('data', function(c){content+=c.toString();});
      process.stdin.on('end', function(){toDot(language, content)});
    } else {
      fs.readFile(process.argv[3], 'utf8', function(err, content){
        if (err) { throw err; }
        toDot(language, content);
      });
    }
  } else {
    throw "Can't find pseudo-language based on " + language + " at " + languages_path;
  }
});
