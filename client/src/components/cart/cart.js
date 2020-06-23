import React, { Component } from 'react';
import '../../App.css';
import './cart.css';
import { Card, Form, Button} from 'react-bootstrap'
import axios from 'axios'
import plus from '../../plus.png'
import minus from '../../minus.png'
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBLnX0vhfSy3b0xDcyf5Vz85GijrUzeZHc");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("us");

const createTransactionUrl = 'http://credit.17-356.isri.cmu.edu/api/transactions';


export class Cart extends Component {
  constructor() {
    super();
    this.state = {
      donuts: [],
      quantity: [],
      cart: [],
      order: [],
      total: 0,
      menu: true,
    }
  }

  componentDidMount() {
    axios.get('/donuts')
      .then(res => {
        const donuts = res.data;
        let prevCart = localStorage.getItem('cart');
        let len = donuts.length;
        let quantity = Array(len).fill(0);

        if (prevCart === null || JSON.parse(prevCart).length === 0) {
          this.setState({
            donuts: donuts,
            quantity: quantity
          });
        } else {
          let prevCartJson = JSON.parse(prevCart);
          let donutIds = new Set();
          donuts.forEach((donut, i) => {
            donutIds.add(donut.id);
          });
          let updatedCart = [];
          prevCartJson.forEach((item, i) => {
            if (donutIds.has(item[3])) {
              updatedCart.push(item);
            }
          });
          for (let i = 0; i < donuts.length; i++) {
            let donutId = donuts[i].id;
            updatedCart.forEach((item, j) => {
              if (item[3] === donutId) {
                quantity[i] = item[1];
              }
            });
          }
          this.setState({
            donuts: donuts,
            quantity: quantity,
            cart: updatedCart
          });
        }
      });
  }

  handleIncrement = (e, i) => {
    let some_array = this.state.quantity;
    some_array[i] = some_array[i] + 1;
    this.setState({
      quantity: some_array
    });
    let donutId = this.state.donuts[i].id;
    let new_cart = this.state.cart;
    let found = false;
    for (let i = 0; i < new_cart.length; i++) {
      let cartItem = new_cart[i];
      let cartItemId = cartItem[3];
      if (cartItemId === donutId) {
        cartItem[1]++;
        found = true;
      }
    }
    if (found === false) {
      new_cart.push([this.state.donuts[i].name, this.state.quantity[i], this.state.donuts[i].price, this.state.donuts[i].id])
    }
    this.setState({
      cart: new_cart
    });

    // update cart in localStorage
    localStorage.setItem('cart', JSON.stringify(new_cart));

    this.setState({
      total: (Number(this.state.total) + Number(this.state.donuts[i].price)).toFixed(2)
    })
  };

  changeState = () => {
    this.setState({
      menu: false
    })
  };

  changeToMenu = () => {
    this.setState({
      menu: true
    })
  };

  handleDecrement = (e, i) => {
    let some_array = this.state.quantity;
    let itemQuantity = some_array[i];
    if (itemQuantity > 0) {
      some_array[i]--;
      this.setState({
        quantity: some_array
      });

      let donutId = this.state.donuts[i].id;
      let oldCart = this.state.cart;

      for (let i = 0; i < oldCart.length; i++) {
        let cartItem = oldCart[i];
        let cartItemId = cartItem[3];
        if (cartItemId === donutId) {
          cartItem[1]--;
        }
      }

      let new_cart = [];
      for (let i = 0; i < oldCart.length; i++) {
        let cartItem = oldCart[i];
        let cartItemQuantity = cartItem[1];
        if (cartItemQuantity > 0) {
          new_cart.push(cartItem);
        }
      }

      this.setState({
        cart: new_cart
      });

      // update cart in localStorage
      localStorage.setItem('cart', JSON.stringify(new_cart));
    }

    this.setState({
      total: (Number(this.state.total) - Number(this.state.donuts[i].price)).toFixed(2)
    })
  };

  handleFormChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  openNewPage = () => {
    let errors = [];
    if (typeof(this.state.newOrderAddress) === 'undefined' || this.state.newOrderAddress === "") errors.push("Address is invalid");
    if (typeof(this.state.newOrderCity) === 'undefined' || this.state.newOrderCity === "") errors.push("City is invalid");
    if (typeof(this.state.newOrderState) === 'undefined' || this.state.newOrderState === "") errors.push("State is invalid");
    if (/^(( ?[A-Za-z])*)$/.test(this.state.newOrderCustomer) === false) errors.push("Name is invalid");
    if (/^[\w]([^@\s,;]+)@(([\w-]+\.)+(com|edu|org|net|gov|mil|biz|info))$/.test(this.state.newOrderEmail) === false) errors.push("Email is invalid");
    if (/^([0-9]{10})$/.test(this.state.newOrderPhone) === false) errors.push("Phone is invalid");
    if (/^([0-9]{5})$/.test(this.state.newOrderZipcode) === false) errors.push("Zipcode is invalid");
    if (errors.length !== 0) {
      window.alert(errors);
      return;
    }
    Geocode.fromAddress(this.state.newOrderAddress + ", " + this.state.newOrderCity + ", " + this.state.newOrderState).then(
      response => {
        const {lat, lng} = response.results[0].geometry.location;
        let donuts = [];
        for (let i in this.state.cart) {
          donuts.push({
            donut: this.state.cart[i][0],
            quantity: this.state.cart[i][1],
            price: this.state.cart[i][2],
          });
        }

        fetch('/orders', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customer: this.state.newOrderCustomer,
            email: this.state.newOrderEmail,
            phone: this.state.newOrderPhone,
            address: this.state.newOrderAddress,
            city: this.state.newOrderCity,
            state: this.state.newOrderState,
            zipcode: this.state.newOrderZipcode,
            total: this.state.total,
            lat: lat,
            lng: lng,
            status: "unprocessed",
            drone: null,
            donuts: donuts,
          })
        }).then(async (response) => {
          this.state.order = await response.json();
          console.log("Status" + response.status);
        });

        fetch(createTransactionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: "amount=" + this.state.total + "&companyId=" + 3
        }).then(async (response) => {
          let result = await response.json();
          let transId = result["id"];
          window.open(`http://credit.17-356.isri.cmu.edu/?transaction_id=${transId}`);
          setInterval(() => {
            fetch(`http://credit.17-356.isri.cmu.edu/api/transactions/${transId}`, {
              method: "GET",
            }).then(async (response) => {
              let result = await response.json();
              let status = result["status"];
              if (status === "approved") {
                let bodyData = {
                  status: "processed",
                };
                fetch('/orders/' + this.state.order.id, {
                  method: 'PATCH',
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(bodyData)
                }).then(async (response) => {
                  if (response.status === 200) {
                    // Success for updating order?
                  } else {
                    window.alert("Failed to update the order!");
                  }
                });
                window.alert("Please record your order ID: " + this.state.order.id);
                window.location = '/order';
              }
              // else if (status === "denied") { ... }
            });
          }, 1000);
        }).catch(error => console.log(error));

      },
      error => {
        window.alert(error);
      }
    );
  };

  render() {
    let menuItems = [];
    for (let i in this.state.donuts) {
      let currDonut = this.state.donuts[i];
      menuItems.push(
        <div key={i} className="cards">
          <Card style={{ width: '19rem', margin: "30px", "borderStyle": "solid", "borderWidth": "15px", "borderColor": "#FFF4F9"}}>
            <Card.Img variant="top" src={`./uploads/${currDonut.photo}`} style={{height: '300px'}} alt=""/>
            <Card.Body>
              <Card.Title>{currDonut.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">${currDonut.price}</Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">{currDonut.calories} calories</Card.Subtitle>
              <Card.Text>
                Qt: {this.state.quantity[i]}
              </Card.Text>
              <div className="buttons">
                {this.state.quantity[i] === 0 ? (<Button variant="light" disabled><img src={minus} width="30px" height="30px" alt=""/></Button>):
                  (<Button id={i} variant="light"><img src={minus} width="30px" height="30px" alt="" onClick={e => this.handleDecrement(e,i)}/></Button>)}
                <Button id={i} variant="light"><img src={plus} width="30px" height="30px" alt="" onClick={e => this.handleIncrement(e,i)}/></Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    }
      let checkoutItems = [];
      let numDonuts = 0;
      let lastKey = 0;
      let sum = 0;
      for (let i in this.state.cart) {
        numDonuts = numDonuts + this.state.cart[i][1];
        lastKey = i;
        sum = sum + parseFloat(this.state.cart[i][2])*this.state.cart[i][1]
        checkoutItems.push(
            <tr key={i}>
              <td>{this.state.cart[i][0]}</td>
              <td>{this.state.cart[i][1]}</td>
              <td>${(this.state.cart[i][1]*parseFloat(this.state.cart[i][2])).toFixed(2)}</td>
            </tr>
        )
      }
      sum = sum.toFixed(2);
      this.state.total = sum;
      checkoutItems.push(
        <tr key={lastKey+1}>
          <td>Total</td>
          <td>{numDonuts}</td>
          <td>${sum}</td>
        </tr>
      );

      return (
        <div>
          {this.state.menu === true ?
            (<div>
              <div className="menuCustomer">
                {menuItems}
              </div>
              {numDonuts > 0 ?
                (<div style={{display: "flex", "justify-content": "center", "padding-bottom": "35px"}}>
                  <Button id="EnabledMenuCheckoutButton" style={{width: '30rem'}} variant="outline-dark" size="lg" onClick={this.changeState} block>
                    Checkout
                  </Button>
                </div>) : (
                  <div style={{display: "flex", "justify-content": "center", "padding-bottom": "35px"}}>
                    <Button id="DisabledMenuCheckoutButton" style={{width: '30rem'}} variant="outline-dark" size="lg" block disabled>
                      Checkout
                    </Button>
                  </div>
                )
              }

            </div>)
            : (
              <div className="cart">
                <div className="cardsCustomer">
                  <Card style={{ width: '45rem', margin: "10px", "borderStyle": "solid", "borderWidth": "15px", "borderColor": "#FFF4F9"}}>
                    <Card.Body>
                      <h5 className="card-title">Order Summary</h5>
                      <table className="table">
                        <thead>
                        <tr>
                          <th>Donut</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {checkoutItems}
                        </tbody>
                      </table>
                      <Button id="checkout-button" variant="outline-dark" size="lg" onClick={this.changeToMenu} block>Edit Order</Button>
                    </Card.Body>
                  </Card>
                </div>
                <div className="cards">
                  <Card style={{ width: '45rem', margin: "10px", "borderStyle": "solid", "borderWidth": "15px", "borderColor": "#FFF4F9"}}>
                    <Card.Header>Delivery Details</Card.Header>
                    <Card.Body>
                      <Form>
                        <Form.Group id="input-address">
                          <Form.Label>Name</Form.Label>
                          <Form.Control placeholder="Enter your name" onChange={this.handleFormChange} name="newOrderCustomer"/>
                          <Form.Label>Email</Form.Label>
                          <Form.Control placeholder="Enter your email" onChange={this.handleFormChange} name="newOrderEmail"/>
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control placeholder="Enter your Phone Number" onChange={this.handleFormChange} name="newOrderPhone"/>
                          <Form.Label>Address</Form.Label>
                          <Form.Control placeholder="Search delivery address" onChange={this.handleFormChange} name="newOrderAddress"/>
                          <Form.Label>City</Form.Label>
                          <Form.Control placeholder="Search delivery address" onChange={this.handleFormChange} name="newOrderCity"/>
                          <Form.Label>State</Form.Label>
                          <Form.Control placeholder="Search delivery address" onChange={this.handleFormChange} name="newOrderState"/>
                          <Form.Label>Zipcode</Form.Label>
                          <Form.Control placeholder="Search delivery address" onChange={this.handleFormChange} name="newOrderZipcode"/>
                        </Form.Group>
                        <Button id="checkout-button" variant="outline-dark" size="lg" onClick={this.openNewPage} block>
                          Proceed to Checkout
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </div>
              </div>)
          }
        </div>
      );
    }
}

export default Cart;
