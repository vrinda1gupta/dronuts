import React, {Component} from "react";
import { Button, Card, ListGroup } from 'react-bootstrap'
import {Link} from "react-router-dom";
import axios from 'axios'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

export class PairingPage extends Component {
  constructor(props) {
    super(props);
    if (typeof this.props.location.state === 'undefined') {
      this.state = {
        order: [],
        drones:[],
        availableDrone: null,
        viewLoc: false,
        buttonName: "Check Delivery"
      }
    } else {
      let redirectionId = this.props.location.state.redirectId;
      this.state = {
        order: [],
        drones:[],
        availableDrone: null,
        orderId: redirectionId,
        viewLoc: false,
        buttonName: "Check Delivery"
      };
    }
  }

  componentDidMount() {
    axios.get('/orders/' + this.state.orderId)
      .then(res => {
        const order = res.data;
        if (order.drone !== null) {
          fetch(`http://drones.17-356.isri.cmu.edu/api/drones/${order.drone}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          }).then(async (response) => {
            let result = await response.json();
            let lat = result["current_delivery"]["destination"]["lat"];
            let long = result["current_delivery"]["destination"]["lng"];
            let status = result["current_delivery"]["status"];
            let currlat = result["location"]["lat"];
            let currlong = result["location"]["long"];
            let time_arrive = result["current_delivery"]["route"]["time_arrive"];
            let time_sent = result["current_delivery"]["route"]["time_start"];
            this.setState({
              lat: lat,
              long: long,
              status: status,
              currlat: currlat,
              currlong: currlong,
              time_arrive: time_arrive,
              time_sent: time_sent
            })
          }).catch(error => console.log(error));
        }
        this.setState({order: order});
      });
  };

  //************************//
  //    Helper Functions    //
  //************************//
  // Gets all of the drones for "teamD" company
  getDrones = () => {
    fetch(`http://drones.17-356.isri.cmu.edu/api/airbases/teamD2`, {
      method: "GET",
    }).then(async (response) => {
      let result = await response.json();
      this.state.drones = result["drones"];
      window.alert("Drones " + this.state.drones + " are under your command!");
      //Other things to catch issues?
    }).catch(error => console.log(error));
  };

  // Gets an available drone for the "teamD" company
  getAvailableDrone = () => {
    for (let index = 0; index < this.state.drones.length; index++) {
      fetch(`http://drones.17-356.isri.cmu.edu/api/drones/${this.state.drones[index]}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      }).then(async (response) => {
        let result = await response.json();
        if (result["current_delivery"] === null) {
          this.state.availableDrone = this.state.drones[index];
        }
      }).catch(error => console.log(error));
    }
    if (this.state.availableDrone) {
      window.alert("Drone " + this.state.availableDrone + " is ready for loading!");
    }
    else {
      window.alert("All drones have insufficient charge and cannot deliver!");
    }
    return null;
  }

  getDeliveryStatus = () => {
    let newName = "Check Delivery";
    if (this.state.viewLoc === false) newName = "Hide Delivery Info";
    this.setState({
      viewLoc: !this.state.viewLoc,
      buttonName: newName });
    this.forceUpdate();
  }


  // "Pairs" the drone to the current order and changes the status of the order
  pairDrone = (e) => {
    console.log(this.state.availableDrone);
    if (this.state.availableDrone) {
      let num = this.state.availableDrone;
      let bodyData = {
        status: "fulfilling",
        drone: num,
      };
      fetch('/orders/' + this.state.order.id, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
      }).then(async (response) => {
        if (response.status === 200) {
          window.alert("Drone has been successfully paired to order!");
          window.location.reload(false);
        } else {
          window.alert("Drone has failed to pair!");
        }
      });
    } else {
      window.alert("Drone has failed to pair!");
    }
    // Reload the window to show changes
  };

  // Sends the drone paired to the order if there is one
  sendDrone = (e) => {
    if (this.state.order.drone) {
      //
      let sendData = {
        lat: this.state.order.lat,
        lon: this.state.order.lng,
      };

      fetch(`http://drones.17-356.isri.cmu.edu/api/drones/${this.state.order.drone}/send`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sendData)
      }).then(async (response) => {
        if (response.status === 204) {
          window.alert("Successfully sent the drone!");
          // Reload the window to show changes
          window.location.reload(false);

          let bodyData = {
            status: "delivering",
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
        } else {
          window.alert("Failed to send drone!");
        }
      });
    } else {
      window.alert("Failed to send drone!");
    }
  };

  //************************//
  //         Render         //
  //************************//
  render() {
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    const mapStyles = {
      width: '95%',
      height: '75%',
    };
    let orderDonuts = [];
    let totalDonuts = 0;
    let subtotal = 0;
    let finalTotal = 0;
    let lastKey = 0;
    for (let i in this.state.order.donuts) {
      totalDonuts = totalDonuts + this.state.order.donuts[i].quantity;
      subtotal = this.state.order.donuts[i].price.$numberDecimal * 1;
      finalTotal = finalTotal + subtotal;
      lastKey = i;
      orderDonuts.push(
        <tr key={i}>
          <td>{this.state.order.donuts[i].donut}</td>
          <td>{this.state.order.donuts[i].quantity}</td>
          <td>${subtotal.toFixed(2)}</td>
        </tr>
      )
    }
    orderDonuts.push(
      <tr key={lastKey+1}>
        <td>Total</td>
        <td>{totalDonuts}</td>
        <td>${finalTotal.toFixed(2)}</td>
      </tr>
    );

    return (
      <div className="container my-4">
        <Card className="text-left">
          <Card.Header>Order {this.state.order.id}</Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-4">
                <Card bg="white">
                  <Card.Header>Order Summary</Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <div className="row">
                            <div className="col"><span>Customer:</span></div>
                            <div className="col"><span>{this.state.order.customer}</span></div>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className="row">
                            <div className="col"><span>Email:</span></div>
                            <div className="col"><span>{this.state.order.email}</span></div>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className="row">
                            <div className="col"><span>Phone:</span></div>
                            <div className="col"><span>{this.state.order.phone}</span></div>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className="row">
                            <div className="col"><span>Address:</span></div>
                            <div className="col"><span>{this.state.order.address}</span></div>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className="row">
                            <div className="col"><span>City:</span></div>
                            <div className="col"><span>{this.state.order.city}</span></div>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className="row">
                            <div className="col"><span>State:</span></div>
                            <div className="col"><span>{this.state.order.state}</span></div>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className="row">
                            <div className="col"><span>Zipcode:</span></div>
                            <div className="col"><span>{this.state.order.zipcode}</span></div>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className="row">
                            <div className="col"><span>Status:</span></div>
                            <div className="col"><span>{this.state.order.status}</span></div>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <div className="row">
                            <div className="col"><span>Drone Number:</span></div>
                            <div className="col"><span>{this.state.order.drone}</span></div>
                          </div>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Text>
                  </Card.Body>

                </Card>
                <div className="my-4">
                  {this.state.order.drone === null ?
                    (<div><Button variant="outline-dark" size="lg" block onClick={e => this.getDrones(e)}>
                      Queue Drones
                    </Button>
                      <Button variant="outline-dark" size="lg" block onClick={e => this.getAvailableDrone(e)}>
                        Get Available Drone
                      </Button>
                      <Button variant="outline-dark" size="lg" block onClick={e => this.pairDrone(e)}>
                        Pair Drone
                      </Button>
                      <Button variant="outline-dark" size="lg" block onClick={e => this.sendDrone(e)}>
                        Send Delivery
                      </Button></div>) :
                    (<div>
                      <Button variant="outline-dark" size="lg" block onClick={e => this.getDeliveryStatus(e)}>
                        {this.state.buttonName}
                      </Button>
                    </div>) }
                  <br></br><Link
                  to={{
                    pathname: '/orders'
                  }}>
                  <Button variant="outline-dark" size="lg" block>
                    Return to Dashboard
                  </Button>
                </Link>
                </div>
              </div>

              <div className="col-8">
                <Card>
                  <Card.Header>Order Details</Card.Header>
                  <Card.Body>
                    <table className="table">
                      <thead>
                      <tr>
                        <th>Donut</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                      </thead>
                      <tbody>
                      {orderDonuts}
                      </tbody>
                    </table>
                  </Card.Body>
                </Card><br></br>
                {this.state.viewLoc === false ? null :
                  (<div><Card style={{height: "600px"}}>
                    <Card.Header>Delivery Status</Card.Header>
                    <Card.Body>
                      STATUS: {this.state.status.toUpperCase()} <br></br>
                      START TIME: {this.state.time_sent}<br></br>
                      ARRIVAL TIME: {this.state.time_arrive} <br></br>
                      <Map
                        google={this.props.google}
                        zoom={10}
                        style={mapStyles}
                        initialCenter={{ lat: this.state.lat, lng: this.state.long}}
                      >
                        <Marker lat={this.state.lat} lng={this.state.lng} />
                        <Marker lat={this.state.currlat} lng={this.state.currlong} icon={image} />
                      </Map>
                    </Card.Body>
                  </Card></div>)}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBLnX0vhfSy3b0xDcyf5Vz85GijrUzeZHc'
})(PairingPage);
