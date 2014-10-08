var fs = require('fs');
var assert = require('assert');
var parse = require('../parse');

describe('Parse Reply', function () {
  var files = fs.readdirSync(__dirname + '/files');
  files.forEach(function (ff) {
    if (!ff.match(/^.*.input.txt$/)) return;
    var output = ff.replace('input.txt', 'output.txt');
    it('should parse ' + ff + ' and produce ' + output, function () {
      var input = fs.readFileSync(__dirname + '/files/' + ff).toString();
      var expected = fs.readFileSync(__dirname + '/files/' + output).toString();
      var produced = parse(input);
      assert.equal(produced.trim(), expected.trim());
    });
  });
});

