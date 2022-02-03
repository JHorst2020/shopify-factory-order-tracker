import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useHistory} from "react-router-dom"
import { format, compareAsc } from 'date-fns'

//? Material UI
import {Grid, Dialog, TextField, Select, Checkbox, FormGroup, FormControlLabel, InputAdornment, Switch} from "@mui/material"
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from '@mui/material/styles'

import {getBGNExchangeRate, updateVendorPricing, createVendorPricing, getVendorPricing} from "../../store/vendors" 

const theme = createTheme({
    palette:{
        button: {
            main:'#0091E2',
            light:'#0091E230',
            dark:'#30b5ff',
            contrastText:'white'
        },
        button2: {
            main:'#FCA311',
            // light:'#FCA31130',
            // dark:'#30b5ff',
            // contrastText:'white'
        },
    },
    typography: {
        h5: {
            fontWeight: "bold",
            // color: "#14213D"
            // color: "white"
            color: "#FCA311"
        },
        h6: {
            fontWeight: "600",
            color: "rgba(98, 98, 98, 1)",
        },
        h7: {
            color: "#8F94A4",
            fontWeight: 600,
        },
        body1: {
            color: "#14213D",
            // fontWeight: 600,
        },
    },
  
  })

const VendorPricingModal = (props) => {
    const currVendor = props.vendor
    const dispatch = useDispatch()

    const shopifyInfo = useSelector(state => state.orders.shopifyOrders)
    const categoryList = useSelector(state => state.items.Categories)
    const pricingList = useSelector(state => state.vendor.pricing)

    const exchangeRate = props.liveExchangeRate

   
    const [vendorExchangeRate, setVendorExchangeRate] = useState(1)
    const [combinedCatPrice, setCombinedCatPrice] = useState([])
 

    const initialLoad = async() => {
        
        setVendorExchangeRate(exchangeRate?.BGN)
        // const currFactoryPricing = pricingList.find(x => x.id == currVendor.id).Pricings
        const currFactoryPricingTest = pricingList.find(x => x.id == currVendor.id)
        const currFactoryPricing = (pricingList.find(x => x.id == currVendor.id)).Pricings
        // console.log("this is the currTest:    ", currVendor.id)
        
        const formatFactoryPricingArr = []
        categoryList.forEach(ele=>{
            const currFactoryItemPricing = currFactoryPricing.find(x => x.category == ele.id)
            // console.log("this is the currFactoryItemPricing:    ", currFactoryItemPricing)
            
            let priceObj = {...ele}
            priceObj.category = ele.id
            priceObj.factory = currVendor.id
            priceObj.pricingLocal = currFactoryItemPricing == null ? "" : currFactoryItemPricing?.pricingLocal
            priceObj.existingPricing = currFactoryItemPricing?.id == null ? false : true
            priceObj.existingPricingId = currFactoryItemPricing?.id == null ? null : currFactoryItemPricing?.id
            formatFactoryPricingArr.push(priceObj)
        })
        setCombinedCatPrice(formatFactoryPricingArr)
    }

    useEffect(()=>{
        initialLoad()
    },[])

    const handleCloseModal = () => {
        props.closeModal(false)
        // console.log("this is the categoryList:    ", categoryList)
        // console.log("this is the pricingList:    ", pricingList)
        // console.log("this is the pricingList:    ", combinedCatPrice)
        // console.log("this is the currFactoryPricing:    ", currFactoryPricing)
        // props.closeModal(false)
    }

    const handleUpdatePricing = (input, index) => {
        const cloneArr = [...combinedCatPrice]
        cloneArr[index] = {...cloneArr[index], pricingLocal: input}
       setCombinedCatPrice([...cloneArr])
    }

    const handleSubmitPricing = async() => {
        const newFactoryCats = []
        const existingFactoryCats = []
        combinedCatPrice.forEach((ele)=> {
            if(ele.existingPricingId){
                delete ele.id
                existingFactoryCats.push(ele)
            } else {
                delete ele.id
                if(ele.pricingLocal == "") return
                newFactoryCats.push(ele)
            }
        })
        await dispatch(createVendorPricing({pricingArr:newFactoryCats}))
        await dispatch(updateVendorPricing({pricingArr:existingFactoryCats}))
        await props.reloadVendors()
        props.closeModal(false)
    }


    return(
        <Grid container >
            <ThemeProvider theme={theme}> 
                <Paper sx={{width:"100%"}}>
                    <Grid container  >
                        <Grid item xs={12} sx={{backgroundColor:"#14213D", p:2}}> 
                            <Typography variant="h5">Factory Pricing - {currVendor.name}</Typography>
                        </Grid>

                        {combinedCatPrice.map((ele, index)=>{
                            let itemPriceConversion = parseFloat(parseFloat(combinedCatPrice[index].pricingLocal).toFixed(2)/vendorExchangeRate, 10).toFixed(2)
                            // console.log("this is itemPriceConversion", itemPriceConversion, Number.isNaN(parseInt(itemPriceConversion)))
                            return(
                            <Grid item container xs={12} spacing={2} sx={{p:2}}>
                                <Grid item xs={6} container justifyContent='center' >
                                    {index == 0 ? <Typography variant='h6'>Category</Typography> : null}
                                    <Grid item xs={12} container justifyContent='center' alignItems='center'>
                                        <Typography variant="h7">{ele.name}</Typography>
                                    </Grid>
                                </Grid>   
                                <Grid item xs={2} container justifyContent='center'>
                                    {index == 0 ? <Typography variant='h6'>{currVendor.currency}</Typography> : null}
                                    <TextField variant='outlined' fullWidth value={combinedCatPrice[index].pricingLocal} InputProps={{
                                        endAdornment:combinedCatPrice[index].pricingLocal != null && combinedCatPrice[index].pricingLocal != "" ? <InputAdornment position="end">Лв.</InputAdornment> : null,
                                    }} onChange={(e)=>handleUpdatePricing(e.target.value, index)} />
                                </Grid>   
                                <Grid item xs={2} container justifyContent='center'>
                                    {index == 0 ? <Typography variant='h6'>USD</Typography> : null}
                                    <TextField variant='outlined' value={Number.isNaN(parseInt(itemPriceConversion)) ? "" : itemPriceConversion } fullWidth InputProps={{
                                        startAdornment:combinedCatPrice[index].pricingLocal != null && combinedCatPrice[index].pricingLocal != "" ? <InputAdornment position="start">$</InputAdornment> : null,
                                    }}/>
                                </Grid>   
                            </Grid>
                            )
                        })}
                        
                        
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid item xs={4} sx={{p:2}}>
                            <Button color="button2" variant="outlined" onClick={handleCloseModal} fullWidth>close</Button>
                        </Grid>
                        <Grid item xs={4} sx={{p:2}}>
                        <Button color="primary" style={{backgroundColor:"#FCA311"}} variant="contained" onClick={handleSubmitPricing} fullWidth>Update</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </ThemeProvider>
        </Grid>
    )
}

export default VendorPricingModal