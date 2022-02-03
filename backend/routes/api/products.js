const express = require("express");
const { check } = require("express-validator");
const fetch = require('node-fetch')
 
const asyncHandler = require("express-async-handler");
const {Category, ContactInfo, CustomerOrder,Factory, FactoryOrder,File,LineItem,Pricing,Product,User} = require("../../db/models")

const router = express.Router();


router.get("/", asyncHandler(async(req, res) => {
    const allItems = await Product.findAll({})
    const allCategories = await Category.findAll({})
    return res.json({allItems, allCategories})
}))

router.post("/create", asyncHandler(async(req, res) => {
    const {itemFamily, itemName, item, xs, s, m, l, xl, category} = req.body
    const newItem = await Product.create({itemFamily, itemName, item, xs, s, m, l, xl, category})
    return res.json({newItem})
}))

router.get("/my-categories", asyncHandler(async(req, res) => {
    const currentCategories = await Category.findAll({where:{isActive:true}})
    return res.json({currentCategories})
}))

router.post("/create-category", asyncHandler(async(req, res) => {
    const {name} = req.body
    const newCategory= await Category.create({name, isActive:true})
    return res.json({newCategory})
}))


module.exports = router