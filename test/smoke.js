var helper = require('./helper');
var Joi = require('joi');
var assert = require('assert');

describe('when size = 0 (smoke test)', function() {
  var res = { items: null };
  var expected = { count: 0 };

  before(function(done) {
    var opts = { schema: {}, size: 0 };
    helper.getResults(opts, function (err, items) {
      if (err) return done(err);
      res.items = items;
      done();
    });
  });

  it('should not insert any entry', function () {
    assert.equal(expected.count, res.items.length);
  });
});

describe('when size is small', function() {
  var res = { items: null };
  var expected = {
    count: 5,
    schema: Joi.object().keys({
      _id: Joi.any().required()
    }).length(1)
  };

  before(function(done) {
    var opts = { schema: {}, size: 5 };
    helper.getResults(opts, function (err, items) {
      if (err) return done(err);
      res.items = items;
      done();
    });
  });

  it('should have the correct size', function () {
    assert.equal(expected.count, res.items.length);
  });

  it('should have entries with only _id field', function () {
    res.items.forEach(function (item) {
      Joi.validate(item, expected.schema, function(err, val) {
        assert.ifError(err);
      });
    });
  });
});

describe('basic schema', function() {
  var res = { items: null };
  var expected = {
    count: 5,
    schema: Joi.object().keys({
      _id: Joi.any().required(),
      username: Joi.string().required(),
      email: Joi.string().email().required(),
    }).length(3)
  };

  before(function(done) {
    var opts = {
      size: 5,
      schema: {
        username: '{{chance.name()}}',
        email: '{{chance.email()}}'
      }
    };
    helper.getResults(opts, function (err, items) {
      if (err) return done(err);
      res.items = items;
      done();
    });
  });

  it('should have the correct size', function () {
    assert.equal(expected.count, res.items.length);
  });

  it('should produce correct schema structure', function () {
    res.items.forEach(function (item) {
      Joi.validate(item, expected.schema, function(err, val) {
        assert.ifError(err);
      });
    });
  });

  it('should produce entries with random content', function (done) {
    helper.sampleAndStrip(res.items, 2, function (sample) {
      assert.notDeepEqual(sample[0], sample[1]);
      done();
    });
  });
});
