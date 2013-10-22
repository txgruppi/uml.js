var util = require('util');

function Variable(name, type) {
  if (this.constructor != Variable) {
    return new Variable(name, type);
  }
  this.name = name;
  this.type = type || null;
}

module.exports = Variable;
