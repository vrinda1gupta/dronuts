var mongoose = require('mongoose');
var expect = require('chai').expect;

const models = require('./models.js');
var Donut = models.Donut;
var Order = models.Order;

/**************************/
/*   Order Schema Tests   */
/**************************/
// *** Basic Validation Tests *** //
// Checks that a valid Order object has no errors
describe('order', function() {
  it('should be valid if no required fields are left empty', function(done) {
  	// Valid donuts to use in test
    var d0 = new Donut({name: "Chocolate Sprinkles", calories: 200, price: 4.42, available: 300, photo: "path/to/photo/chocolate_sprinkles.png", description: "Chocolate donut with sprinkles"});
  	var d1 = new Donut({name: "Glaze", calories: 180, price: 3.92, available: 400, photo: "path/to/photo/glaze.png", description: "Donut with Glaze, simple"});

  	var o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: "delivering", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});
  });
});

// Checks that empty required fields create an error
describe('order', function() {
  it('should be invalid if a required field is left empty', function(done) {
    // Valid donuts to use in test
    var d0 = new Donut({name: "Chocolate Sprinkles", calories: 200, price: 4.42, available: 300, photo: "path/to/photo/chocolate_sprinkles.png", description: "Chocolate donut with sprinkles"});
  	var d1 = new Donut({name: "Glaze", calories: 180, price: 3.92, available: 400, photo: "path/to/photo/glaze.png", description: "Donut with Glaze, simple"});

    // Checks that an empty customer field creates an error
    var o = new Order({ email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", status: "delivering", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
      expect(err.errors.customer).to.exist;
      done();
    });

    // Checks that an empty email field creates an error
    o = new Order({customer: "Alice Adel", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", status: "delivering", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
      expect(err.errors.email).to.exist;
      done();
    });

    // Checks that an empty phone field creates an error
    o = new Order({customer: "Alice Adel", email: "aadel@email.com", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", status: "delivering", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
      expect(err.errors.phone).to.exist;
      done();
    });

    // Checks that an empty address field creates an error
    o = new Order({customer: "Alice Adel", phone: "4120000001", city: "Pittsburgh", zipcode: "15213", total: "15.93", status: "delivering", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
      expect(err.errors.address).to.exist;
      done();
    });

    // Checks that an empty city field creates an error
    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", state: "PA", zipcode: "15213", total: "15.93", status: "delivering", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
      expect(err.errors.city).to.exist;
      done();
    });

    // Checks that an empty state field creates an error
    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", zipcode: "15213", total: "15.93", status: "delivering", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
      expect(err.errors.state).to.exist;
      done();
    });

    // Checks that an empty zipcode field creates an error
    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", total: "15.93", status: "delivering", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
      expect(err.errors.zipcode).to.exist;
      done();
    });

    // Checks that an empty total field creates an error
    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", status: "delivering", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
      expect(err.errors.total).to.exist;
      done();
    });

    // Checks that an empty status field creates an error
    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
      expect(err.errors.status).to.exist;
      done();
    });

    // // Checks that an empty donuts field creates an error //TO_DO: Figure out why it is fine with taking no donuts
    // o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", status: "delivering", drone: "78"});
  	// o.validate(function(err) {
    //   expect(err.errors.donuts).to.exist;
    //   done();
    // });


    // Checks that all empty required fields create an error
    o = new Order({drone: 78});
    o.validate(function(err) {
      expect(err.errors.customer).to.exist;
      expect(err.errors.email).to.exist;
    	expect(err.errors.phone).to.exist;
    	expect(err.errors.address).to.exist;
    	expect(err.errors.city).to.exist;
      expect(err.errors.state).to.exist;
    	expect(err.errors.zipcode).to.exist;
    	expect(err.errors.total).to.exist;
    	expect(err.errors.status).to.exist;
    	// expect(err.errors.donuts).to.exist;  //TO_DO: Figure out why it is fine with taking no donuts
      done();
    });
  });
});

// Checks that all non-required fields can be empty
describe('order', function() {
  it('should be valid if a non-required field is left empty', function(done) {
    // Valid donuts to use in test
    var d0 = new Donut({name: "Chocolate Sprinkles", calories: 200, price: 4.42, available: 300, photo: "path/to/photo/chocolate_sprinkles.png", description: "Chocolate donut with sprinkles"});
  	var d1 = new Donut({name: "Glaze", calories: 180, price: 3.92, available: 400, photo: "path/to/photo/glaze.png", description: "Donut with Glaze, simple"});

	  // Checks that an empty drone field does not create an error
    var o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: "delivering", donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
    o.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });
});


// Checks that a Order object's 'status' field is restricted to ["unprocessed", "fulfilling", "delivering", "completed"]
describe('order', function() {
  it('should be invalid if a Order objects staus field is not an accepted enum value', function(done) {
    // Valid donuts to use in test
    var d0 = new Donut({name: "Chocolate Sprinkles", calories: 200, price: 4.42, available: 300, photo: "path/to/photo/chocolate_sprinkles.png", description: "Chocolate donut with sprinkles"});
  	var d1 = new Donut({name: "Glaze", calories: 180, price: 3.92, available: 400, photo: "path/to/photo/glaze.png", description: "Donut with Glaze, simple"});

  	// These 'status' field values should not create errors
    var o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: "unprocessed", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});

    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: "processed", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});

    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: "fulfilling", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});

    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: "delivering", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});

    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: "completed", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
  		expect(err).to.not.exist;
  		done();
  	});

  	// These 'status' field values should create errors
    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: "processing", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
  		expect(err).to.exist;
  		done();
  	});

    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: 1, drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
  		expect(err).to.exist;
  		done();
  	});

    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: "complete", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
  		expect(err).to.exist;
  		done();
  	});

    o = new Order({customer: "Alice Adel", email: "aadel@email.com", phone: "4120000001", address: "5000 Forbes Avenue", city: "Pittsburgh", state: "PA", zipcode: "15213", total: "15.93", lat: 38.8951, lng: -77.0364, status: "deliver", drone: 78, donuts: [{donut: "Apple", quantity: 4, price: 2}, {donut: "Cinnamon", quantity: 8, price: 2}]});
  	o.validate(function(err) {
  		expect(err).to.exist;
  		done();
  	});
  });
});
