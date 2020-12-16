import React from "react";

import { Navbar, Nav, Dropdown, Badge, Button } from "react-bootstrap";

import { Link } from "react-router-dom";
import {connect} from"react-redux"
import {logout} from "../action"


class Navigation extends React.Component {
    btnLogout = () => {
        this.props.logout()
        localStorage.removeItem('email')
    }
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand as={Link} to="/">Navbar</Navbar.Brand>
          <Nav className="mr-auto">

          </Nav>

          <Link to="/cart">
            <Button size="sm" variant="light">
              cart
              <Badge variant="dark" style={{ fontSize: "0.7rem" }}>

                {this.props.cart.length}
              </Badge>
            </Button>
          </Link>


          <Dropdown style={{ marginRight: "45px" }}>
            <Dropdown.Toggle variant="light" id="dropdown-basic" size="sm">
              {this.props.email ? this.props.email : "Username"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {this.props.email ? (
                <>
                  <Dropdown.Item
                    as={Link}
                    to={
                      this.props.role === "admin"
                        ? "/history_admin"
                        : "/history"
                    }
                  >
                    History
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.btnLogout}>Logout</Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item as={Link} to="/login">
                    Login
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps=(state)=>{
    return{
        email:state.users.email,
        cart:state.users.cart
    }
}

export default connect(mapStateToProps,{logout})(Navigation);
