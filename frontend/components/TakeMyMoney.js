import React,{Component} from "react"
import StripeCheckout from "react-stripe-checkout"
import {Mutation} from 'react-apollo'
import Router from "next/router"
import NProgress from "nprogress"
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import calcTotalPrice from "../lib/calcTotalPrice"
import Error from "./ErrorMessage"
import User,{CURRENT_USER_QUERY} from "./User"


const CREATE_ORDER_MUTATION=gql`
    mutation CREATE_ORDER_MUTATION($token:String!){
        createOrder(token:$token){
            id
            charge
            total
            items{
                id
                title
                quantity
                price
                image
            }
        }
    }
`;
function totalItems(cart) {
    return cart.reduce((tally,cartItem)=>tally+cartItem.quantity,0);
}
class TakeMyMoney extends Component{

    onToken= async (res,createOrderFunc)=>{
        NProgress.start();
      console.log(res);
      const order=await createOrderFunc({variables:{token:res.id}}).catch(err=>alert(err.message));
      console.log(order);
      Router.push({
          pathname:"/order",
          query:{id:order.data.createOrder.id}
      });

    };
    render(){
        return(
            <User>
                {
                    ({data:{me}})=><Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{query:CURRENT_USER_QUERY}]}>
                        {
                            (createOrderFunc)=>(
                                <StripeCheckout
                                    amount={calcTotalPrice(me.cart)}
                                    name="Sick Fits"
                                    description={`Order of your ${totalItems(me.cart)} items`}
                                    // 购物车里必须有Items
                                    image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                                    stripeKey="pk_test_SafbTDNwUyiB8JU439J7q9UG"
                                    currency="USD"
                                    email={me.email}
                                    token={res=>this.onToken(res,createOrderFunc)}
                                >{this.props.children}</StripeCheckout>
                            )
                        }

                    </Mutation>
                }
            </User>
        )
    }
}
export default TakeMyMoney