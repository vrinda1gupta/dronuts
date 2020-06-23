import React, { Component } from 'react';
import '../../App.css';
import './menu.css';
import {Card, Form, Modal, Button, ButtonToolbar } from 'react-bootstrap'
import edit from '../../edit.png'
import axios from 'axios'
import {Link} from "react-router-dom";
import ImageUploader from 'react-images-upload'

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-90w"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          New Item Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-4">
            <ImageUploader
              withIcon={true}
              buttonText='Choose images'
              onChange={props.onDrop}
              imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
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
                <Form id="addEditNewItemForm">
                  <Form.Group controlId="editMenuItemName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder="Enter Item Name" onChange={props.onChange} name="newItemName"/>
                  </Form.Group>

                  <Form.Group controlId="editMenuItemDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control placeholder="Enter a Short Description for the Item" onChange={props.onChange} name="newItemDescription"/>
                  </Form.Group>

                  <Form.Group controlId="editMenuItemCalories">
                    <Form.Label>Calories</Form.Label>
                    <Form.Control placeholder="Enter Calories" onChange={props.onChange} name="newItemCalories"/>
                  </Form.Group>

                  <Form.Group controlId="editMenuItemQuantAvail">
                    <Form.Label>Quantity Available</Form.Label>
                    <Form.Control placeholder="Enter Quantity Available" onChange={props.onChange} name="newItemQuantity"/>
                  </Form.Group>

                  <Form.Group controlId="editMenuItemPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control placeholder="Enter Price of Item" onChange={props.onChange} name="newItemPrice"/>
                  </Form.Group>

                  <Button id="submitNewItemButton" variant="outline-dark" size="lg" block type="submit" onSubmit={props.onSubmit}>
                    Add
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

function MyModalEntry(props) {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <ButtonToolbar>
      <Button id="addNewItem"
              variant="outline-dark"
              size="lg"
              onClick={() => setModalShow(true)} block
      >Add New Item</Button>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onChange={props.onChange}
        onSubmit={props.onSubmit}
        onDrop={props.onDrop}
      />
    </ButtonToolbar>
  );
}

export class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donuts: [],
      pictures: [],
    };
    this.onDrop = this.onDrop.bind(this);

  }

  componentDidMount() {
    axios.get('/donuts')
      .then(res => {
        const donuts = res.data;
        this.setState({donuts: donuts});
      });
  }

  handleFormChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  sendNewItem = (e) => {
    let body = JSON.stringify({
      name: this.state.newItemName,
      calories: this.state.newItemCalories,
      price: this.state.newItemPrice,
      quantity: this.state.newItemQuantity,
      photo: 'default.png',
      description: this.state.newItemDescription
    });
    if (this.state.pictures.length !== 0) {
      body['photo'] = this.state.pictures[0].name;
    }
    fetch('/donuts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    }).then(async (response) => {
      console.log(response.status);
    });

    const data = new FormData();
    data.append('image', this.state.pictures[0]);
    axios.post('/uploadfile', data)
      .then(res => console.log(res.status));
  };

  deleteItem = (donutId) => {
    fetch('/donuts/' + donutId, {
      method: 'DELETE'
    }).then(async (response) => {
      console.log(response.status);
    });
    window.location.reload();
  };

  onDrop(pictureFiles) {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles)
    });
  }

  render() {
    const menuItems = this.state.donuts;

    return (
      <div>
          <div id="itemCount" style={{"font-size":"0px"}}>Number of Items: {menuItems.length}</div>
          <div className="menu">
            {
              menuItems.map(donut => {
                return <div className="cards">
                  <Card style={{ width: '18rem', margin: "30px", "borderStyle": "solid", "borderWidth": "15px", "borderColor": "#FFF4F9"}}>
                    <Card.Img variant="top" src={`./uploads/${donut.photo}`} style={{height: '300px'}} alt=""/>
                    <Card.Body>
                      <Card.Title>
                        <Link
                          to={{
                            pathname: '/editMenuItemPage',
                            state: {redirectId: donut.id}
                          }}>
                          <Button class="menuItemEditButton" variant="light">
                            <img src={edit} width="20px" height="20px" alt=""/>{donut.name}
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          className="ml-2"
                          onClick={() => this.deleteItem(donut.id)}
                        >
                          Delete Item</Button>
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{donut.price}</Card.Subtitle>
                      <Card.Text>
                        Qt: {donut.quantity}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              })
            }
        </div>
        <div style={{display: "flex", "justify-content": "center", "padding-bottom": "50px"}}>
        <MyModalEntry
          onChange={this.handleFormChange}
          onSubmit={this.sendNewItem}
          onDrop={this.onDrop}
        />
        </div>
      </div>
    );
  }
}

export default Menu;
