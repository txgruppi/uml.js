#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var languages_path = path.join(__dirname, '..', 'languages');

function compile(language, content) {
  var JSONFactory = require('../lib/factories/json');
  var doc = (new JSONFactory()).build(language.parse(content));

  if (process.argv[4] === 'json') {
    console.log(JSON.stringify(doc));
  } else {
    var GraphvizDot = require('../lib/exporters/graphvizdot');
    var dot = new GraphvizDot(doc);
    console.log(dot.export());
  }
}

fs.readdir(languages_path, function(err, list){
  if (err) { throw err; }
  var language = process.argv[2];
  if (list.indexOf(language) != -1) {
    var language = require(path.join(languages_path, language, language));
    if (process.argv[3] == '-') {
      var content = '';
      process.stdin.on('data', function(c){content+=c.toString();});
      process.stdin.on('end', function(){compile(language, content)});
    } else {
      fs.readFile(process.argv[3], 'utf8', function(err, content){
        if (err) { throw err; }
        compile(language, content);
      });
    }
  } else {
    throw "Can't find pseudo-language based on " + language + " at " + languages_path;
  }
});
