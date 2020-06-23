/*************************/
/*   Import Statements   */
/*************************/
import React, {Component} from "react";
import { Button, Card, Form } from 'react-bootstrap'
import axios from "axios";
import ImageUploader from "react-images-upload";
import {Link} from "react-router-dom";


/*************************/
/*  Class Implementation */
/*************************/
export class EditMenuItemPage extends Component {
  constructor(props) {
    super(props);
    if (typeof this.props.location.state === 'undefined') {
      this.state = {
        item: [],
        pictures: []
      }
    } else {
      let redirectionId = this.props.location.state.redirectId;
      this.state = {
        item: [],
        pictures: [],
        itemId: redirectionId
      };
    }
    this.onDrop = this.onDrop.bind(this);
  }

  componentDidMount() {
    axios.get('/donuts/' + this.state.itemId)
      .then(res => {
        const donut = res.data;
        this.setState({item: donut});
      });
  }

  handleFormChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitNewItem = (e, donutId) => {
    let bodyData = {
      name: this.state.itemNewName,
      calories: this.state.itemNewCalories,
      price: this.state.itemNewPrice,
      quantity: this.state.itemNewQuantity,
      description: this.state.itemNewDescription
    };
    if (this.state.pictures.length !== 0) {
      bodyData['photo'] = this.state.pictures[0].name;
      const data = new FormData();
      data.append('image', this.state.pictures[0]);
      axios.post('/uploadfile', data)
        .then(res => console.log(res.status));
    }
    fetch('/donuts/' + donutId, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    }).then(async (response) => {
      if (response.status === 200) {
        window.alert("Successfully updated the item!");
        window.location = "/menu"
      } else {
        window.alert("Update failed!");
      }
    });
  };

  onDrop(pictureFiles) {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles)
    });
  }

  render() {
    return (
      /* Edit Menu Item Form */
      <div className="container my-4 text-left">
        <Card>
          <Card.Header>Edit Menu Item</Card.Header>
          <Card.Body>
            <div className="row">
              {/* Current Photo and Upload Photo Option */}
              <div className="col-4">
                <Card.Img variant="top" src={`./uploads/${this.state.item.photo}`}/>
                <ImageUploader
                  withIcon={true}
                  buttonText='Choose images'
                  onChange={this.onDrop}
                  imgExtension={['.jpg', '.gif', '.png', 'jpeg']}
                  maxFileSize={5242880}
                  singleImage={true}
                  withPreview={true}
                  name='image'
                />
              </div>

              {/* Edit Menu Item Form */}
              <div className="col-8">
                <Card>
                  <Card.Body>
                    <Form>
                      <Form.Group controlId="editMenuItemName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control defaultValue={this.state.item.name} onChange={this.handleFormChange} name="itemNewName"/>
                      </Form.Group>

                      <Form.Group controlId="editMenuItemDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control defaultValue={this.state.item.description} onChange={this.handleFormChange} name="itemNewDescription"/>
                      </Form.Group>

                      <Form.Group controlId="editMenuItemCalories">
                        <Form.Label>Calories</Form.Label>
                        <Form.Control defaultValue={this.state.item.calories} onChange={this.handleFormChange} name="itemNewCalories"/>
                      </Form.Group>

                      <Form.Group controlId="editMenuItemQuantAvail">
                        <Form.Label>Quantity Available</Form.Label>
                        <Form.Control defaultValue={this.state.item.quantity} onChange={this.handleFormChange} name="itemNewQuantity"/>
                      </Form.Group>

                      <Form.Group controlId="editMenuItemPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control defaultValue={this.state.item.price} onChange={this.handleFormChange} name="itemNewPrice"/>
                      </Form.Group>

                      <Button
                        id="submitNewItemButton" variant="outline-dark" size="lg" block
                        onClick={e => this.submitNewItem(e, this.state.item.id)}
                      >
                        Submit
                      </Button>
                      <Link
                        to={{
                          pathname: '/menu',
                        }}>
                        <Button variant="outline-dark" size="lg" block style={{"margin-top":"10px"}}>Cancel</Button>
                      </Link>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };
}

/*************************/
/*   Export Statements   */
/*************************/
export default EditMenuItemPage;
