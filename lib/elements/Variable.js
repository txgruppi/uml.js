var util = require('util');

function Variable(name, type) {
  this.name = name;
  this.type = type || null;
}

module.exports = Variable;
