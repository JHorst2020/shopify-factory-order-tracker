import {fetch} from "./csrf"
export const LIST_VENDORS = "./vendors/LIST_VENDORS"
export const LIST_VENDOR_PRICING = "./vendors/LIST_VENDOR_PRICING"
export const EXCHANGE_RATE = "./vendors/EXCHANGE_RATE"
export const SHOW_ORDERS = "./vendors/SHOW_ORDERS"

const showExchangeRate = (exchangeRate) => ({
    type: EXCHANGE_RATE,
    exchangeRate
})

const showVendorOrders = (orders) => ({
    type: SHOW_ORDERS,
    orders
})

const listVendors = (vendors) => ({
    type: LIST_VENDORS,
    vendors
})

const listVendorPricing = (pricing) => ({
    type: LIST_VENDOR_PRICING,
    pricing
})

export const getBGNExchangeRate = () => async(dispatch) => {
    const res = await fetch('api/vendors/exchange-rate-bgn')
    dispatch(showExchangeRate(res.data.exchangeRate))
    return res.data.exchangeRate
}

export const getVendors = () => async(dispatch) => {
    const res = await fetch('/api/vendors')
    dispatch(listVendors(res.data.allFactories))
    return res.data.allFactories
}

export const getAllVendorOrders = () => async(dispatch) => {
    const res = await fetch('/api/vendors/orders')
    dispatch(showVendorOrders(res.data))
    return res.data
}

export const createVendorOrder = (payload) => async(dispatch) => {
    const res = await fetch('/api/vendors/create-order', {method:"POST", body:JSON.stringify(payload)})
    return res.data
}

export const updateVendorOrderCost = (payload) => async(dispatch) => {
    const res = await fetch('/api/vendors/order', {method:"PUT", body:JSON.stringify(payload)})
    return res.data
}

export const updateFactoryOrderStatus = (payload) => async(dispatch) => {
    const res = await fetch('/api/vendors/order-status', {method:"PUT", body:JSON.stringify(payload)})
    return res.data
}

export const updateLineItemStatus = (payload) => async(dispatch) => {
    const res = await fetch('/api/vendors/line-item-status', {method:"PUT", body:JSON.stringify(payload)})
    return res.data
}

export const createLineItem = (payload) => async(dispatch) => {
    const res = await fetch('/api/vendors/create-line-item', {method:"POST", body:JSON.stringify(payload)})
    return res.data
}

export const searchForLineItems = (payload) => async(dispatch) => {
    const res = await fetch('/api/vendors/search-line-items', {method:"POST", body:JSON.stringify(payload)})
    return res.data
}

export const getVendorPricing = (vendorId) => async(dispatch) => {
    const res = await fetch('/api/vendors/pricing')
    dispatch(listVendorPricing(res.data.vendorPricing))
    return 
}

export const createVendorPricing = (payload) => async(dispatch) => {
    const res = await fetch('/api/vendors/pricing',{method:"POST", body:JSON.stringify(payload)})
    // dispatch(listVendorPricing(res.data.vendorPricing))
    return res.data
}

export const updateVendorPricing = (payload) => async(dispatch) => {
    const res = await fetch('/api/vendors/pricing',{method:"PUT", body:JSON.stringify(payload)})
    // dispatch(listVendorPricing(res.data.vendorPricing))
    return res.data
}


export const addNewVendor = (payload) => async(dispatch) => {
    const res = await fetch('/api/vendors/',
    {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }
    )
    dispatch(listVendors(res.data))
    return 
}

export const getFactoryInfo = (payload) => async(dispatch) => {
    const res = await fetch('api/vendors/factory-info', {
        method:"POST",
        body: JSON.stringify(payload)
    })
    return res.data
}

export const sendEmail = (payload) => async(dispatch) => {
    const res = await fetch('/api/vendors/send-email',{
        method: 'POST',
        headers: { 'Content-Type': "multipart/form-data" },
        body: payload,
        // data: getFormData
        // body: await JSON.stringify(getFormData)
    })
    // dispatch(listVendorPricing(res.data.vendorPricing))
    return res.data
}

const initialState = {
    Vendors: [],
    pricing:[],
    exchangeRate:{}, 
    orders:[],
}

const vendorReducer = (state = initialState, action) => {
    switch (action.type){
        case SHOW_ORDERS:{
            return{
                ...state,
                orders: action.orders
            }
        }
        case EXCHANGE_RATE:{
            return{
                ...state,
                exchangeRate: action.exchangeRate
            }
        }
        case LIST_VENDORS:{
            return{
                ...state,
                Vendors: action.vendors
            }
        }
        case LIST_VENDOR_PRICING:{
            return{
                ...state,
                pricing: action.pricing
            }
        }
        default:
            return state
    }
}

export default vendorReducer