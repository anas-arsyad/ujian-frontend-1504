import React from "react";
import Axios from "axios";
import { Card, Button, Modal,Toast } from "react-bootstrap";

import { connect } from "react-redux";
import { login } from "../action";

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      toModal: false,
      ID: null,
      newQty: 0,
      toast:false
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

  showBodyModal = () => {
    return this.state.data.map((item, idx) => {
      if (this.state.ID === item.id) {
        return (
          <div>
            <h3>{item.name}</h3>
            <h6>IDR {item.price.toLocaleString()}</h6>
            <label>Stock: {item.stock}</label>
            <div style={{ display: "flex" }}>
              <Button
                variant="primary"
                onClick={() => this.setState({ newQty: this.state.newQty - 1 })}
                disabled={this.state.newQty <= 1 ? true : false}
              >
                min
              </Button>
              <h4>{this.state.newQty}</h4>

              <Button
                variant="primary"
                onClick={() =>
                  this.setState(
                    this.state.newQty >= item.stock
                      ? alert("melebihi stok")
                      : { newQty: parseInt(this.state.newQty) + 1 }
                  )
                }
              >
                plus
              </Button>
            </div>
          </div>
        );
      }
      return console.log();
    });
  };

  btnCart = (id) => {
    this.setState({ toModal: true, ID: id, newQty: 1 });
    // this.showBodyModal(id)
  };
  btnAddCart = () => {
    const { data, newQty } = this.state;

    console.log(this.props.cart);
    return data.map((item, idx) => {
      if (this.state.ID === item.id) {
        let cartData = {
          id: item.id,
          name: item.name,
          image: item.img,
          price: item.price,
          qty: newQty,
          total: newQty * item.price,
          stock: item.stock,
        };

        let tempCart = this.props.cart;
        let idIndex;
        tempCart.map((item1, idx1) => {
          if (item.id === item1.id) {
            return (idIndex = idx1);
          }
          return console.log();
        });

        if (idIndex !== undefined) {
          return (
            console.log(2, false),
            (tempCart[idIndex].qty += newQty),
            Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
              cart: tempCart,
            })
              .then((res) => {
                console.log(res.data);
                this.setState({ toModal: false,toast:true });
              })
              .catch((err) => console.log(err))
          );
        } else {
          return (
            tempCart.push(cartData),
            Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
              cart: tempCart,
            })
              .then((res) => {
                console.log(res.data);
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                  .then((res) => {
                    console.log(res.data);
                    this.props.login(res.data);
                    this.setState({ toModal: false,toast:true });
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err))
          );
        }
      }
      return console.log();
    });
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "35px",
          justifyContent: "space-evenly",
        }}
      >
        {this.state.data.map((item, idx) => {
          return (
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src={item.img} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  <b>IDR {item.price.toLocaleString()}</b>{" "}
                </Card.Text>
                <Button onClick={() => this.btnCart(item.id)}>buy</Button>
              </Card.Body>
            </Card>
          );
        })}

        <Modal
          show={this.state.toModal}
          onHide={() => this.setState({ toModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.showBodyModal()}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.btnAddCart}>
              to Cart
            </Button>
          </Modal.Footer>
        </Modal>

        <Toast show={this.state.toast} onClose={()=>this.setState({toast:false})}>
          <Toast.Header>
            <strong className="mr-auto">notif</strong>
            <small>1 sec ago</small>
          </Toast.Header>
          <Toast.Body>Berhasil di add</Toast.Body>
        </Toast>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.users.cart,
    id: state.users.id,
  };
};
export default connect(mapStateToProps, { login })(Products);
