import React, {Component} from "react";
import './orders.css';
import '../../App.css';
import { Card, Button } from 'react-bootstrap'
import axios from 'axios'
import { Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const CaptionElement = () =>
  <h3 style={{ borderRadius: '0.25em', textAlign: 'center', color: 'purple', border: '1px solid purple', padding: '0.5em' }}>
    Order Dashboard
  </h3>;

function viewButtonFormatter(cell, row, rowIndex, formatExtraData) {
  return (
    <Link
      to={{
        pathname: '/pairingPage',
        state: {redirectId: row.id}
      }}>
      <Button variant="light">View</Button>
    </Link>
  );
}

export class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      columns: [
        {
          text: 'Order ID',
          dataField: 'id',
        },
        {
          text: 'Customer',
          dataField: 'customer',
        },
        {
          text: 'Total',
          dataField: 'total',
        },
        {
          text: 'Status',
          dataField: 'status',
        },
        {
          text: 'View',
          dataField: 'view',
          formatter: viewButtonFormatter,
        },
      ]
    };
  }

  componentDidMount() {
    axios.get('/orders')
      .then(res => {
        const orders = res.data;
        let validOrders = [];
        for (let i in orders) {
          if (orders[i].status !== "unprocessed") validOrders.push(orders[i])
        }
        this.setState({orders: validOrders});
      });
  }

  render() {
    const orders = this.state.orders;

    return (
      <div className="container">
        <Card className="text-center">
          <Card.Body>
            <table id='students'>
              <tbody>
              <BootstrapTable
                bootstrap4
                hover
                keyField='id'
                data={orders}
                caption={<CaptionElement/>}
                columns={this.state.columns}
                bordered={false}
                pagination={paginationFactory()}
                headerClasses={'table-header'}
              />
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Orders;
