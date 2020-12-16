import React from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";

import Axios from "axios"

import {Redirect} from "react-router-dom"
import {connect} from "react-redux"

import {login} from "../action"



class Login extends React.Component {
    constructor(props){
        super(props)
        this.state={
            emailValidErr:[false,""],
            passValidErr:[false,""],
            directHome:false
        }
    }

    userEmail=(event)=>{
        let email=event.target.value

        let rgxEmail=/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!rgxEmail.test(email)) return this.setState({emailValidErr:[true,"*Wrong email"]})
        this.setState({emailValidErr: [false, ""]})
    }

    passValidErr=(event)=>{
        let pass=event.target.value
        //regex
        let angka = /[0-9]/
        let symb = /[!@#$%^&*;]/

        if(!symb.test(pass)||pass.length<6||!angka.test(pass)) return this.setState({ passValidErr: [true, "*Must include symbol, number, min 6 char"] })

        this.setState({passValidErr: [false, ""]})
    }


    btnLogin=()=>{
        let {emailValidErr,passValidErr} =this.state

        let email=this.refs.email.value
        let password=this.refs.password.value
          console.log(email,password)
        if(!email||!password) return alert("ISI DULU")
        if(emailValidErr[0]||passValidErr[0]) return alert("masih ada yang belum terpenuhi")

        Axios.get(`http://localhost:2000/users?username=${email}&password=${password}`)
        .then((res)=>{
            if(res.data.length===0){
                Axios.post(`http://localhost:2000/users`,{email,password,cart:[]})
                    .then((res)=>{
                        console.log(res.data[0])
                        
                    })
            }else{
                console.log(res.data[0])
                this.setState({directHome:true})
                  this.props.login(res.data[0])
                   // localStorage.setItem('username', username)
                  localStorage.email=email
                  
            }
        })
        .catch((err) => console.log(err));
    }
    render() {
    if(this.state.directHome) return <Redirect to="/"/>
    if (this.props.email) return  <Redirect to="/" /> 
    // console.log(this.props.username)
    return (
      <div style={{background:"url(https://images.unsplash.com/photo-1473010350295-2c82192ebd8e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80) no-repeat center",backgroundSize:"cover",height:"88.6vh",display:"flex",justifyContent:"center"}}>
      <div style={{backgroundColor:"rgba(255, 255, 255, 0.6)",width:"450px",height:"330px",borderRadius:"25px",marginTop:"50px",padding:"10px"}}>
      <Form style={{ margin: "auto", width: "350px" }}>
          <h1>Login</h1>
        <Form.Label><b>Email</b></Form.Label>
        <InputGroup className="mb-3">
        
          <FormControl 
          onChange={(event)=>this.userEmail(event)}
            ref="email"
            placeholder="Email"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <Form.Text  className="mb-3" style={{color:"red",fontSize:"10px"}}>{this.state.emailValidErr[1]}</Form.Text>

        <Form.Label><b>Password</b></Form.Label>
        <InputGroup className="mb-3">

          <FormControl 
          onChange={(event)=>this.passValidErr(event)}
          ref="password"
            placeholder="Password"
            aria-label="Password"
            
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <Form.Text  className="mb-3" style={{color:"red",fontSize:"10px"}}>{this.state.passValidErr[1]}</Form.Text>

        <Button variant="primary" onClick={this.btnLogin}>Login</Button>
      </Form>
      </div>
      </div>
    );
  }
}

const mapStateToProps=(state)=>{
    return{
        email:state.users.email
    }
}

export default connect(mapStateToProps,{login}) (Login);
