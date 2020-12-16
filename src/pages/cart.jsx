import React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Table, Button, Modal, Image } from "react-bootstrap";
import { login } from "../action";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      editIdx: null,
      newQty: 0,
      errEmpty: false,
      validPass: false,
      tempProduct: [],
      ID: null,
      modal: false,
    };
  }

  componentDidMount() {
    Axios.get("http://localhost:2000/products")
      .then((res) => {
        console.log(res.data);
        this.setState({ data: res.data });
      })
      .catch((err) => console.log(err));
  }
  btnCancel = () => {
    this.setState({ editIdx: null });
  };

  btnDelete = (idx) => {
    let tempCart = this.props.cart;
    // console.log(cartData)
    tempCart.splice(idx, 1);

    Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
      cart: tempCart,
    })
      .then((res) => {
        console.log(res.data);

        Axios.get(`http://localhost:2000/users/${this.props.id}`)
          .then((ress) => this.props.login(ress.data))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  btnSave = (idx) => {
    let tempProduct = this.props.cart[idx];
    tempProduct.qty = parseInt(this.state.newQty);
    tempProduct.total = this.state.newQty * tempProduct.price;
    console.log(tempProduct);

    let tempCart = this.props.cart;
    tempCart.splice(idx, 1, tempProduct);

    Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
      cart: tempCart,
    })
      .then((ress) => {
        Axios.get(`http://localhost:2000/users/${this.props.id}`).then(
          (ress) => {
            this.props.login(ress.data);
            this.setState({ editIdx: null });
            console.log(ress.data);
          }
        );
      })
      .catch((err) => console.log(err));
  };

  showTable = () => {
    return (
      <Table striped bordered hover variant="dark" size="sm">
        <thead>
          <tr>
            <th>No</th>
            <th>Image</th>
            <th>Nama Barang</th>
            <th>Jumlah</th>
            <th>Harga</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {this.props.cart.map((item, idx) => {
            if (this.state.editIdx === idx) {
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <Image style={{ width: "8rem" }} src={item.image} rounded />
                  </td>
                  <td>{item.name}</td>

                  <td style={{ textAlign: "center", display: "flex" }}>
                    <Button
                      variant="light"
                      onClick={() =>
                        this.setState({ newQty: this.state.newQty - 1 }
                        )
                      }
                      disabled={this.state.newQty <= 1 ? true : false}
                    >
                      min
                    </Button>
                    <h4>{this.state.newQty}</h4>

                    <Button
                      variant="light"
                      onClick={() =>
                        this.setState(
                          this.state.newQty >= item.stock
                            ? this.setState({ modal: true })
                            : { newQty: parseInt(this.state.newQty) + 1 }
                        )
                      }
                    >
                      plus
                    </Button>
                  </td>
                  <td>IDR {item.price.toLocaleString()}</td>
                  <td>
                    IDR {(item.price * this.state.newQty).toLocaleString()}
                  </td>
                  <td>
                    <Button
                      onClick={() => this.btnSave(idx)}
                      variant="success"
                      className="mr-2"
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button variant="danger" size="sm" onClick={this.btnCancel}>
                      Cancel
                    </Button>
                  </td>
                </tr>
              );
            }
            return (
              <tr key={idx}>
                {console.log(this.props.cart)}
                <td>{idx + 1}</td>
                <td>
                  <Image style={{ width: "8rem" }} src={item.image} rounded />
                </td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>IDR {item.price.toLocaleString()}</td>
                <td>IDR {item.total.toLocaleString()}</td>
                <td>
                  <Button
                    onClick={() =>
                      this.setState({
                        editIdx: idx,
                        newQty: item.qty,
                        newSize: item.size,
                        titleDrop: item.size,
                      })
                    }
                    variant="warning"
                    className="mr-2"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => this.btnDelete(idx)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  btnCheckOut = () => {
    // if (this.props.cart.length === 0) return this.setState({ errEmpty: true });

    this.setState({ validPass: true });

    console.log(this.props.cart);
  };

  btnConfirm = () => {
   

    this.props.cart.map((item)=>{
      return this.state.data.map((item1)=>{
            if(item.id===item1.id){
                
               let tempStock=item1.stock-item.qty
                Axios.patch(`http://localhost:2000/products/${item1.id}`, {stock:tempStock})
              .then((res) => {
                  console.log(res.data)
              })
              .catch((err) => console.log(err))
            }
            return console.log();
        })

    })


    let history = this.props.cart
    Axios.post("http://localhost:2000/history", history)
      .then((ress) => {
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
          cart: [],
        })
          .then((ress) => {
            Axios.get(`http://localhost:2000/users/${this.props.id}`).then(
              (ress) => {
                this.props.login(ress.data);
                this.setState({ validPass: false});
              }
            );
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  render() {
    console.log(this.props.cart)
    return (
      <div>
        {this.showTable()}
        <Button onClick={this.btnCheckOut}>Checkout</Button>
        <Modal
          show={this.state.modal}
          onHide={() => this.setState({ modal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Melebihi stok</Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
        <Modal
          show={this.state.validPass}
          onHide={() => this.setState({ validPass: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Yakin checkout</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.btnConfirm}>ya</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.users.cart,
    id: state.users.id,
    email: state.users.email,
  };
};

export default connect(mapStateToProps, { login })(Cart);
