/*************************/
/*   Import Statements   */
/*************************/
import React, {Component} from "react";
import { Button, Card, ListGroup } from 'react-bootstrap'
import axios from 'axios'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

/*************************/
/*  Class Implementation */
/*************************/
export class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      order: null,
      orderDonuts: null,
      orderPlaced: null,
      buttonName: "Check Delivery",
      viewLoc: false
    }
  }

  handleChange = (e) => {
    const name = e.target.name;
    this.setState({[name]: e.target.value});
  };

  getDeliveryStatus = () => {
    let newName = "Check Delivery";
    if (this.state.viewLoc === false) newName = "Hide Delivery Info";
    this.setState({
      viewLoc: !this.state.viewLoc,
      buttonName: newName });
    this.forceUpdate();
  };

  render() {
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    const mapStyles = {
      width: '95%',
      height: '75%',
    };
    return (
      <div>
        {this.state.order === null ?
          (<div style={{display: "flex", "justify-content": "center"}}>
            <Card style={{ width: '45rem', margin: "10px", "borderStyle": "solid", "borderWidth": "15px", "borderColor": "#FFF4F9", "margin-top":"40px"}}>
              <Card.Body>
                <form>
                  <h4>Order Number:</h4>
                  <input type="orderId" name="orderId" autoComplete="order number" value={this.state.orderId} onChange={this.handleChange}/><br></br><br></br>
                  <Button id="orderButton" variant="outline-dark" size="lg" onClick={this.getOrder}>Submit</Button>
                </form>
              </Card.Body>
            </Card>
          </div>)
          :
          (<div className="container my-4">
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
                          </ListGroup>

                        </Card.Text>
                      </Card.Body>

                    </Card>


                    <div className="my-4">
                      {this.state.order.status === "delivering" ?
                        <Button id="getdelivery" variant="outline-dark" size="lg" block onClick={e => this.getDeliveryStatus(e)}>
                          {this.state.buttonName}
                        </Button> : null }
                      <Button id="back" variant="outline-dark" size="lg" block onClick={this.clearOrder}>
                        Back
                      </Button>
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
                          {this.state.orderDonuts}
                          </tbody>
                        </table>
                      </Card.Body>
                    </Card>

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
          </div>)

        }

      </div>
    );
  }

  clearOrder = () => {
    this.setState ({
      order: null,
      orderDonuts: null,
    })
  };

  getOrder = () => {
    axios.get('/orders/' + this.state.orderId)
      .then(res => {
        const order = res.data;
        console.log(order);
        let orderDonuts = [];
        let totalDonuts = 0;
        let subtotal = 0;
        let finalTotal = 0;
        let lastKey = 0;
        for (let i in order.donuts) {
          totalDonuts = totalDonuts + order.donuts[i].quantity;
          subtotal = order.donuts[i].price.$numberDecimal * 1;
          finalTotal = finalTotal + subtotal;
          lastKey = i;
          orderDonuts.push(
            <tr key={i}>
              <td>{order.donuts[i].donut}</td>
              <td>{order.donuts[i].quantity}</td>
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
        this.setState({
          order: order,
          orderDonuts: orderDonuts
        });
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
      });
  }
}

/*************************/
/*   Export Statements   */
/*************************/

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBLnX0vhfSy3b0xDcyf5Vz85GijrUzeZHc'
})(Order);