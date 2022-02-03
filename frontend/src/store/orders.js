import {fetch} from "./csrf"
export const LIST_CUSTOMER_ORDERS = "./customerOrder/LIST_CUSTOMER_ORDERS"
export const LIST_SHOPIFY_ORDERS = "./customerOrder/LIST_SHOPIFY_ORDERS"
export const LIST_OPEN_CUSTOMER_ORDERS = "./customerOrder/LIST_OPEN_CUSTOMER_ORDERS"

const showPendingShopifyOrders = (shopifyOrders) => ({
    type: LIST_SHOPIFY_ORDERS,
    shopifyOrders
})

const showOpenCustomerOrders = (openOrders) => ({
    type: LIST_OPEN_CUSTOMER_ORDERS,
    openOrders
})

export const getUnfulfilledShopifyOrders = (payload) => async(dispatch) => {
    const res = await fetch("/api/customer-order/shopify-unfulfilled-order-list", {
        method:"POST",
        body: JSON.stringify({payload})
    })
    if(res.ok){
        await dispatch(showPendingShopifyOrders(res.data.shopifyList))
      
       return res.data.shopifyList
    }
    return []
}

//! Not really related to this app
export const getShopifyInformation = () => async(dispatch) =>{
    const res = await fetch("/api/customer-order/shopify-customer-list")
    return res.data
}

const initialState = {
    customerOrders:[],
    vendorOrders:[],
    openOrders:[],
    canceledOrders:[],
    pendingOrders:[],
    deliveredOrders:[],
    shopifyOrders:[],
}

const ordersReducer = (state = initialState, action) => {
    switch (action.type){
        case LIST_CUSTOMER_ORDERS: {
            return {
                ...state,
                customerOrders: action.shopifyOrders
            }
        }
        case LIST_OPEN_CUSTOMER_ORDERS: {
            return {
                ...state,
                openOrders: action.openOrders
            }
        }
        case LIST_SHOPIFY_ORDERS: {
            return {
                ...state,
                shopifyOrders: action.shopifyOrders
            }
        }
        default: return state
    }
}

export default ordersReducer