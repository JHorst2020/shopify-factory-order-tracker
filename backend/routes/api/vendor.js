const express = require("express");
const { check } = require("express-validator");
const fetch = require('node-fetch')
const multer = require('multer')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
 
const asyncHandler = require("express-async-handler");
const {Category, ContactInfo, CustomerOrder,Factory, FactoryOrder,File,LineItem,Pricing,Product,User} = require("../../db/models")

const router = express.Router();

router.post("/", asyncHandler(async(req, res) => {
    const {companyName, localCurrency, address1, address2, address3, city, state, zipCode, country, email, phone, firstName, lastName} = req.body

    const addLocationInfo = await ContactInfo.create({
        address1, address2, address3, city, state, zipCode, country, email, phone, firstName, lastName
    })
    const getLocationInfoId = await Factory.create({
        name:companyName,
        currency: localCurrency,
        contactInfo: addLocationInfo.id
    })
    return res.json({addLocationInfo, getLocationInfoId})
}))

router.get("/", asyncHandler(async(req, res) => {
    const allFactories = await Factory.findAll({include:[ContactInfo, Pricing]})
    return res.json({allFactories})
}))

router.get("/orders", asyncHandler(async(req, res) => {
    const allOrders = await FactoryOrder.findAll({include:[LineItem, Factory, CustomerOrder ]})
    return res.json(allOrders)
}))

router.post("/factory-info", asyncHandler(async(req, res) => {
    const {id} = req.body
    const factoryInfo = await Factory.findOne({where:{id}, include:[ContactInfo]})
    return res.json(factoryInfo)
}))

router.put("/order", asyncHandler(async(req, res) => {
    const {factory_order_id, localTotal, usdTotal} = req.body
    const updateOrder = await FactoryOrder.update({costUSD:usdTotal, costLocal:localTotal},{where:{id:factory_order_id}})
    const allOrders = await FactoryOrder.findAll({include:[LineItem, Factory, CustomerOrder]})
    return res.json(allOrders)
}))

router.post("/create-order", asyncHandler(async(req, res) => {
    const {factory, factoryPO, customerOrder, status, isActive, isShipped, isPending} = req.body
    const newFactoryOrder = await FactoryOrder.create({factory, factoryPO, customerOrder, status, isActive, isShipped, isPending})
    return res.json(newFactoryOrder)
}))

router.post("/create-line-item", asyncHandler(async(req, res) => {
    const {item, factoryOrder, quantity, xs, s, m, l, xl, status, isCompleted, isShipped, isActive, unitCostLocal, unitCostUSD, shopifyId} = req.body
    const newFactoryLineItem = await LineItem.create({item, factoryOrder, quantity, xs, s, m, l, xl, status, isCompleted, isShipped, isActive, unitCostLocal, unitCostUSD, shopifyId})
    return res.json(newFactoryLineItem)
}))

router.get("/pricing", asyncHandler(async(req, res) => {
    const vendorPricing = await Factory.findAll({include:[Pricing]})
    return res.json({vendorPricing})
}))

router.post("/pricing", asyncHandler(async(req, res) => {
    const {pricingArr} = req.body
    const vendorPricing = await Pricing.bulkCreate(pricingArr)
    return res.json("ok")
}))

router.put("/pricing", asyncHandler(async(req, res) => {
    const {pricingArr} = req.body
    pricingArr.map(async(ele)=>{
        await Pricing.update(ele,{where: {id: ele.existingPricingId}})
    })
    return res.json("ok")
}))

router.put("/order-status", asyncHandler(async(req, res) => {
    const {factoryOrder, status} = req.body
    await FactoryOrder.update({status:status}, {where:{id:factoryOrder}})
    return res.json("ok")
}))

router.put("/line-item-status", asyncHandler(async(req, res) => {
    //TODO: update to bulk update instead of making multiple calls
    const {lineItem, status} = req.body
    const itemUpdate = await LineItem.update({status:status}, {where:{id:lineItem}})
    const findItem = await LineItem.findAll({where:{id:lineItem}})
    return res.json(findItem)
}))

router.post("/search-line-items", asyncHandler(async(req, res) => {
    //TODO: update to bulk update instead of making multiple calls
    const {lineItems} = req.body
    const { Op } = require('sequelize');
    const findItems = await LineItem.findAll({where:{[Op.or]:lineItems}})
    return res.json(findItems)
}))

router.get("/exchange-rate-bgn", asyncHandler(async(req, res) => {
    const exchangeURL = process.env.CURRENCY_API_URL
    const exchangeRes= await fetch(`${exchangeURL}&base_currency=USD`)
    const exchangeRate = await exchangeRes.json()
    let exchangeRateRes
    if(Array.isArray(exchangeRate.data)){
        if(exchangeRate.data.length > 0){
            exchangeRateRes = exchangeRate
        } else {
            const historicalPrice = await fetch(`${process.env.CURRENCY_API_URL_HISTORICAL}&base_currency=USD`)
            const historicalRes = await historicalPrice.json()
            console.log("HistoricalREs:   ", historicalRes)
            const objKey = Object.keys(historicalRes.data)
            console.log("HistoricalREs2:   ", historicalRes.data[objKey[0]])
            exchangeRateRes = historicalRes.data[objKey[0]]
        }
    }
    return res.json({exchangeRate: exchangeRateRes, info:exchangeRate})
}))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("file mimetype:   ", file.mimetype)
      cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  })
  
  const uploadStorage = multer({ storage: storage })

router.post("/send-email", uploadStorage.single("file"),  asyncHandler(async(req, res) => {
        const {attachFactoryPO, attachPackingList} = req.body
        const attachmentArr = []
        console.log("typeof attachFactory:   ", typeof attachFactoryPO, attachFactoryPO == "true", attachPackingList == false)
        if(attachFactoryPO == "true"){
            attachmentArr.push({
                content:req.body.factoryPO,
                filename: `${req.body.filenamePO}.pdf`,
                type: "application/pdf",
                disposition: "attachment"
            })
        }
        if(attachPackingList == "true"){
            attachmentArr.push({
                content:req.body.packingList,
                filename: `${req.body.filenamePL}.pdf`,
                type: "application/pdf",
                disposition: "attachment"
            })
        }
        const msg = {
            to: req.body.to, // Change to your recipient
            from: 'factoryorder@mydolcessa.com', // Change to your verified sender
            subject: req.body.subject,
            text: req.body.text,
            attachments: attachmentArr
          }
          sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
    return res.json("success")
}))

module.exports = router