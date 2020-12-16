const INITIAL_STATE={
    id:"",
    email:"",
    password:"",
    cart:[]
}

const usersReducer=(state=INITIAL_STATE,action)=>{
    switch(action.type){
        case "LOG_IN":
            return{
                ...state,
                password:action.payload.password,
                email:action.payload.email,
                id:action.payload.id,
                cart:action.payload.cart,


            }
        case "LOG_OUT":
            return INITIAL_STATE
        default :
            return state
    }
}

export default usersReducer