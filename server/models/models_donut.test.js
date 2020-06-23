var mongoose = require('mongoose');
var expect = require('chai').expect;

const models = require('./models.js');
var Donut = models.Donut;


/**************************/
/*   Donut Schema Tests   */
/**************************/
// *** Basic Validation Tests *** //
// Checks that a valid Donut object has no errors
describe('donut', function() {
  it('should be valid if no required fields are left empty', function(done) {
  	var d = new Donut({name: "Chocolate Sprinkles", calories: 200, price: 4.42, quantity: 300, photo: "path/to/photo/chocolate_sprinkles.png", description: "Chocolate donut with sprinkles"});
  	d.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});
  });
});

// Checks that empty required fields create an error
describe('donut', function() {
  it('should be invalid if a required field is left empty', function(done) {
    // Checks that an empty name field creates an error
    var d = new Donut({calories: 200, price: 4.42, quantity: 300, photo: "path/to/photo/chocolate_sprinkles.png", description: "Chocolate donut with sprinkles"});
    d.validate(function(err) {
      expect(err.errors.name).to.exist;
      done();
    });

    // Checks that an empty price field creates an error
    d = new Donut({name: "Chocolate Sprinkles", calories: 200, quantity: 300, photo: "path/to/photo/chocolate_sprinkles.png", description: "Chocolate donut with sprinkles"});
    d.validate(function(err) {
      expect(err.errors.price).to.exist;
      done();
    });

    // Checks that an empty available field creates an error
    d = new Donut({name: "Chocolate Sprinkles", calories: 200, price: 4.42, photo: "path/to/photo/chocolate_sprinkles.png", description: "Chocolate donut with sprinkles"});
    d.validate(function(err) {
      expect(err.errors.quantity).to.exist;
      done();
    });

    // Checks that all empty required fields create an error
    d = new Donut({});
    d.validate(function(err) {
    	expect(err.errors.name).to.exist;
      expect(err.errors.price).to.exist;
      expect(err.errors.quantity).to.exist;
      // expect(err.errors.store).to.exist;
      done();
    });
  });
});

// Checks that all non-required fields can be empty
describe('donut', function() {
  it('should be valid if a non-required field is left empty', function(done) {
    // Checks that an empty calories field does not create an error
    var d = new Donut({name: "Chocolate Sprinkles", price: 4.42, quantity: 300, photo: "path/to/photo/chocolate_sprinkles.png", description: "Chocolate donut with sprinkles"});
    d.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });

    // Checks that an empty photo field does not create an error
    d = new Donut({name: "Chocolate Sprinkles", calories: 200, price: 4.42, quantity: 300, description: "Chocolate donut with sprinkles"});
    d.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });

    // Checks that an empty description field does not create an error
    d = new Donut({name: "Chocolate Sprinkles", calories: 200, price: 4.42, quantity: 300, photo: "path/to/photo/chocolate_sprinkles.png"});
    d.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });

    // Checks that all empty non-required fields do not create an error
    d = new Donut({name: "Chocolate Sprinkles", price: 4.42, quantity: 300});
    d.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });
});
