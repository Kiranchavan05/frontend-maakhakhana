
import { useContext, useState } from "react"
// import "../Cart/Cart.css"
import "./PlaceOrder.css"

import { StoreContext } from "../../context/StoreContext"
import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


const PlaceOrder = () => {

  const {getTotalCartAmount, token, food_list, cartItems, url} = useContext(StoreContext)

  const [data,setData]= useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    pincode:"",
    country:"",
    phone:"",

  })

  const onChangeHandler = (event)=>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))

  }

  const placeOrder = async (event)=>{
    event.preventDefault()
    let orderItems = [];
    food_list.map((item)=>{
      if(cartItems[item._id]>0){
        let itemInfo= item;
        itemInfo["quantity"]=cartItems[item._id]
        orderItems.push(itemInfo)
           }

    })

   let orderData = {
    address : data,
    items: orderItems,
    amount : getTotalCartAmount() +2
     }
     let response = await axios.post(url+"/api/order/place", orderData, {headers:{token}})
     if (response.data.success){
      const {session_url} = response.data;
      window.location.replace(session_url)
     }else{
      alert("Error")
     }
  }

  const navigate=useNavigate()
  useEffect(()=>{
    if(!token){
      navigate("/cart")
    }else if(getTotalCartAmount()===0) {
      navigate("/cart")

    }
  },[token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required type="text" value={data.firstName} name="firstName" onChange={onChangeHandler} placeholder="First Name" />
          <input required type="text" value={data.lastName} name="lastName" onChange={onChangeHandler} placeholder="Second Name" />
        </div>
        <input required type="email" value={data.email} name="email" onChange={onChangeHandler}  placeholder="Email address" />
        <input required type="text" value={data.street} name="street" onChange={onChangeHandler} placeholder="Street" />

        <div className="multi-fields">
          <input required type="text" value={data.city} name="city" onChange={onChangeHandler} placeholder="City" />
          <input required type="text" value={data.state} name="state" onChange={onChangeHandler} placeholder="State" />
        </div>

        <div className="multi-fields">
          <input required type="text" value={data.pincode} name="pincode" onChange={onChangeHandler} placeholder="pincode" />
          <input required type="text" value={data.country} name="country" onChange={onChangeHandler} placeholder="Country" />
        </div>

        <input required type="text" value={data.phone} name="phone" onChange={onChangeHandler} placeholder="Phone"/>
       
      </div>
      <div className="place-order-right">
      <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
            <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount()===0?0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${getTotalCartAmount()===0? 0 : getTotalCartAmount()+2}</b>
              </div>
              
            </div>
            <button type="submit" >PROCEED TO PAYMENT</button>
           
          </div>


      </div>
      
    </form>
  )
}

export default PlaceOrder
