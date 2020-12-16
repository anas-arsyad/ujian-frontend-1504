import React from "react";
import Axios from "axios";

import { Table, Button } from "react-bootstrap";
import { connect } from "react-redux";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      data:[]
    };
  }

  componentDidMount() {
    Axios.get(`http://localhost:2000/history`)
      .then((ress) => {
        console.log(ress);
        this.setState({ history: ress.data });
      })
      .catch((err) => console.log(err));

      Axios.get("http://localhost:2000/products")
      .then((res) => {
        console.log(res.data);
        this.setState({ data: res.data });
      })
      .catch((err) => console.log(err));
  }

  btnBatal = (i) => {
    // let temphistory = this.state.history;
    // // console.log(cartData)
    // temphistory.splice(i, 1);
    (this.state.history?this.state.history:[]).map((item)=>{
        return(
          Axios.delete(
            `http://localhost:2000/history/${item.id}`
          ).then((ress) => {
            console.log(ress)
            this.setState({ history: ress.data })
          })
          .catch((err)=>console.log(err))
        )
  
      })
    // Axios.patch(`http://localhost:2000/history`,temphistory)
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((err) => console.log(err));
    // console.log(i)
  };
  render() {
    return (
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Email User</th>
              <th>name Produk</th>
              <th>price</th>
              <th>jumlah</th>
              <th>status</th>
              <th>total</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.history.map((item1, idx1) => {
              return item1.map((item, idx) => {
                return (
                  <tr>
                    <td>#</td>
                    <td>{this.props.email}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.qty}</td>
                    <td>belum bayar</td>
                    <td>{item.total}</td>
                    <td>
                      <Button onClick={()=>this.btnBatal(idx1)}>Batal</Button>
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    email: state.users.email,
  };
};
export default connect(mapStateToProps)(History);
