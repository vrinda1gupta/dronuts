const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
  password: {type: String, required: true}
});

const donutSchema = new Schema({
  name: {type: String, required: true},
  calories: {type: Number, required: false, min: 0},
  price: {type: Schema.Types.Decimal128, required: true, min: 0.00},  // TO-DO: validate that its to two decimal places
  quantity: {type: Number, required: true},
  photo: {type: String, required: false},
  description: {type: String, required: false},
});

donutSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret) => {
    if (ret.price) {
      ret.price= ret.price.toString();
    }
    return ret;
  },
});

const orderSchema = new Schema({
  customer: {type: String, required: true},
  email: {type: String, required: true},
  phone: {type: String, required: true},    //stored as a string incase of leading 0s
  address: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zipcode: {type: String, required: true},  //stored as a string incase of leading 0s
  total: {type: Schema.Types.Decimal128, required: true, min: 0.00,},
  lat: {type: Schema.Types.Decimal128, required: true},
  lng: {type: Schema.Types.Decimal128, required: true},
  status: {
    type: String,
    required: true,
    enum: ["unprocessed", "processed", "fulfilling", "delivering", "completed"]
  },   //can take the values unprocessed (notpaid), fulfilling, delivering, completed
  drone: {type: Number, required: false},  //assigned when fulfilling
  donuts: {
    type: [{
      donut: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Schema.Types.Decimal128,
        required: true
      }
    }],
    required: false
  },
});

orderSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret) => {
    if (ret.total) {
      ret.total = ret.total.toString();
    }
    if (ret.zipcode) {
      ret.zipcode = ret.zipcode.toString();
    }
    return ret;
  },
});

module.exports = {
  Donut: mongoose.model('donut', donutSchema),
  Order: mongoose.model('order', orderSchema),
  Password: mongoose.model('password', passwordSchema),
};
