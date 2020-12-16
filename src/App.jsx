import React from "react";

import Navigation from "./component/navigation";
import { Switch, Route } from "react-router-dom";
import Axios from"axios"
import Home from "./pages/home"
import Login from "./pages/login"
import Cart from "./pages/cart"
import History from "./pages/history"

import {connect} from "react-redux"
import {login} from "./action"


class App extends React.Component{
  componentDidMount(){
    Axios.get(`http://localhost:2000/users?email=${localStorage.email}`)
    .then((res) => this.props.login(res.data[0]))
    .catch((err) => console.log(err))
  }

  render(){
    return (
      <div>
        <Navigation />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} />
          <Route path="/cart" component={Cart} />
          <Route path="/history" component={History} />
        </Switch>
      </div>
    )

  }
}

export default connect(null,{login}) (App);
