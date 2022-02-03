const express = require("express");
const { check } = require("express-validator");
const fetch = require('node-fetch')
 
const asyncHandler = require("express-async-handler");
const {Category, ContactInfo, CustomerOrder,Factory, FactoryOrder,File,LineItem,Pricing,Product,User} = require("../../db/models")

const router = express.Router();

const shopifyURLRoute = `https://${process.env.SHOPIFY_PRIVATE_API_KEY}:${process.env.SHOPIFY_API_PASSWORD}@dolcessa-swimwear.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}`

router.post("/shopify-unfulfilled-order-list", asyncHandler(async(req,res)=>{
    const shopifyList = await fetch(`${shopifyURLRoute}/orders.json?fulfillment_status=unfulfilled`)
    if(!shopifyList.ok){
        return
    }
    const shopifyRes = await shopifyList.json()
    const parsedList = []
    const shopifyOrdersIdArray = []
    const sequelizeSearchFormat = []
    const ordersList = shopifyRes.orders.forEach((ele)=>{
        shopifyOrdersIdArray.push(`${ele.id}`)
        sequelizeSearchFormat.push({shopifyId: `${ele.id}`})
        let unfulfilledItems = []
        let fulfilledItems = []
        // let eleObj = ele
        if (Array.isArray(ele.line_items)){
            ele.line_items.forEach((ele2)=>{
                if(ele2.fulfillment_status == "fulfilled"){
                    fulfilledItems.push(ele2)
                } else {
                    unfulfilledItems.push(ele2)
                }
            })
        }
        let formatOrderDate = ele.created_at.split("T")[0]
        let formatDate = `${formatOrderDate.split("-")[1]}/${formatOrderDate.split("-")[2]}/${formatOrderDate.split("-")[0]}`
        let eleObj = {
            id:ele.id,
            firstName: ele.shipping_address?.first_name,
            lastName: ele.shipping_address?.last_name,
            address1: ele.shipping_address?.address1,
            address2: ele.shipping_address?.address2,
            city: ele.shipping_address?.city,
            state: ele.shipping_address?.province_code,
            zipCode: ele.shipping_address?.zip,
            country: ele.shipping_address?.country_code,
            lineItems: ele.line_items,
            orderDate: formatDate,
            shopifyOrderNumber: ele.order_number,
            shopifyCustomerId: ele.customer?.id,
            customerFirstName: ele.customer?.first_name,
            customerLastName: ele.customer?.last_name,
            fulfilledArray: fulfilledItems,
            unfulfilledArray: unfulfilledItems,
        }
        parsedList.push(eleObj)
    })
    

    // return res.json(ordersInDB)
    return res.json({shopifyList: parsedList, orderIds:shopifyOrdersIdArray, })
}))

router.post("/contact-info", asyncHandler(async(req, res) => {
    const {address1, address2, city, state, zipCode, country, firstName, lastName} = req.body
    const newInfo = await ContactInfo.create({address1, address2, city, state, zipCode, country, firstName, lastName})
    return res.json(newInfo)
}))

router.post("/customer-info", asyncHandler(async(req, res) => {
    const {shipToId} = req.body
    const shipInfo = await ContactInfo.findOne({where:{id:shipToId}})
    return res.json(shipInfo)
}))

router.post("/new-customer-order", asyncHandler(async(req, res) => {
    const {shopifyId,shopifyCustomerId, shipToCustomer,shopifyOrderNumber, shipToAddress,customerFirstName,customerLastName,isActive,isCancelled,isReceived,status,requiresApproval} = req.body
    const newOrder = await CustomerOrder.create({shopifyId,shopifyCustomerId,shopifyOrderNumber, shipToCustomer, shipToAddress,customerFirstName,customerLastName,isActive,isCancelled,isReceived,status,requiresApproval})
    return res.json(newOrder)
}))

router.get("/shopify-customer-list", asyncHandler(async(req, res) => {
    // const shopifyRes = await fetch(`${shopifyURLRoute}/shop.json`)
    const customerBucket = []
    const shopifyRes2 = await fetch(`${shopifyURLRoute}/orders.json?fields=tax_lines,customer`)
    const firstHeader = shopifyRes2.headers.get("Link")
    let status = shopifyRes2.status
    let linkHeader = firstHeader
    let linkHeaderArr = []
    let linkHeaders = []
    let loopCount = 0
    const shopifyOrders = await shopifyRes2.json()
    customerBucket.push(...shopifyOrders.orders)

    const keepGoing = async(header) => {
        const parseHeader = header.split("page_info=")[1].split(">")[0]
        const shopifyLoop = await fetch(`${shopifyURLRoute}/orders.json?page_info=${parseHeader}`)
        status = shopifyLoop.status
        linkHeader = shopifyLoop.headers.get("Link")
        const shopifyLoopRes = await shopifyLoop.json()
        customerBucket.push(...shopifyLoopRes.orders)
        loopCount = parseInt(loopCount) + 1
        linkHeaders.push(parseHeader)
        if(shopifyLoop.status == 200 && loopCount < 10 ){
            linkHeaderArr.push(linkHeader)
           await keepGoing(linkHeader)
        }
    }
    const mainfx = async() => {
        return await keepGoing(linkHeader)
    }
    await mainfx().then(()=>{})
    const parsedBucket = []
    customerBucket.forEach((ele)=>{
        if(ele.tax_lines.length == 0)return
        parsedBucket.push(ele)
        return ele
    })
    return res.json({ linkHeaders})
    
    // while(status == 200 && loopCount < 50){
    //     keepGoing(linkHeader)
    //     setTimeout(()=>{
    //         // console.log(loopCount, linkHeader)
    //         loopCount = (parseInt(loopCount) + 1)
    //     },[525])
    //     return
    // }
    
    
    // return res.json({shopifyShop, shopifyOrderLocation})
}))

module.exports = router;
