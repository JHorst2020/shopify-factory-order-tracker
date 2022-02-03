import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useHistory} from "react-router-dom"
import { format, compareAsc, addYears } from 'date-fns'

//? Material UI
import {Grid, Dialog,DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Select, Checkbox, FormGroup, FormControlLabel, InputAdornment, Switch, Accordion, AccordionSummary, AccordionDetails, Collapse} from "@mui/material"
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from "@mui/material/Box";
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, ThemeProvider } from '@mui/material/styles'

import {getVendors, getBGNExchangeRate, createVendorOrder, createLineItem, updateVendorOrderCost, getAllVendorOrders} from "../../store/vendors"
import {getItems, createItem} from "../../store/items"
import {createContactInfo, createCustomerOrder} from "../../store/customers"

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
        },
        switch: {
            main:'#FCA311',
        },
    },
    typography: {
        h5: {
            fontWeight: "bold",
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
        },
    },
  
  })

const CreateCustomerOrderModal = (props) => {
    const currInput = props.props
    const dispatch = useDispatch()
    const filter = createFilterOptions();

    const shopifyInfo = useSelector(state => state.orders.shopifyOrders)
    const vendorList = useSelector(state => state.vendor.Vendors)
    const itemList = useSelector(state => state.items.Items)
    const categoryList = useSelector(state => state.items.Categories)
    const exchangeRate = useSelector(state=> state.vendor.exchangeRate)
    const vendorOrders = useSelector(state=> state.vendor.orders)

    const [step, setStep] = useState(1)
    const [selectedFactories, setSelectedFactories] = useState([])
    const [factoryOrderInfo, setFactoryOrderInfo] = useState([])
    const [customerInfo, setCustomerInfo] = useState({})
    const [orderDate, setOrderDate] = useState("")
    const [orderInfo, setOrderInfo] = useState([])
    const [unfilArr, setUnfilArr] = useState([])
    const [filArr, setFilArr] = useState([])
    const [myVendors, setMyVendors] = useState([])
    const [isDropShip, setIsDropShip] = useState(false)
    const [shipAddress, setShipAddress] = useState({})
    const [orderLineItems, setOrderLineItems] = useState([])
    const [usedPONums, setUsedPONums] = useState([])
    //? Used for Autocomplete
    const [value, setValue] = useState([]);
    // const [value, setValue] = useState(null);
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        item: "",
        itemFamily: "",
        itemName: "",
        xs:true,
        s:true,
        m:true,
        l: true,
        xl:true,
        category:0
    })

    const [productList, setProductList] = useState([{
        item: "",
        itemFamily: "",
        itemName: "",
        xs:true,
        s:true,
        m:true,
        l: true,
        xl:true,
        category:0
    }])
    const [flatLineItem, setFlatLineItem] = useState([])

    const initialLoad = async () => {
        if(exchangeRate.BGN == null){
            dispatch(getBGNExchangeRate())
        }
       if(vendorList.length == 0){
        const res = await dispatch(getVendors())
        setMyVendors([...res])
       } else {
           setMyVendors(vendorList)
       }
       if(itemList.length == 0){
           const item = await dispatch(getItems())
           setProductList(item.allItems)
        } else {
           setProductList(itemList.allItems)
       }
        const factoryOrderList = await dispatch(getAllVendorOrders())

        const poNums = factoryOrderList.map((ele)=>{
            return ele.factoryPO
        })
        setUsedPONums(poNums)
       
    //    if(Array.isArray(currInput.unfilledArray)){
    //        const unfilledLength = currInput.unfilledArray.length
    //        console.log("This is unfilled Array section: ", unfilledLength)
    //    setValue(new Array(unfilledLength).fill([{value:{
    //        item: "",
    //     itemFamily: "",
    //     itemName: "",
    //     xs:true,
    //     s:true,
    //     m:true,
    //     l: true,
    //     xl:true,
    //     category:0
    // }}]))
    // }
   
    setUnfilArr(currInput.unfulfilledArray)
        setFilArr(currInput.fulfilledArray)
        setOrderDate(currInput.orderDate)
        setCustomerInfo(currInput)
        const lineItemArray = []
        currInput.unfulfilledArray.forEach((ele, index)=>{
            lineItemArray[index] = [{
                ...ele, 
                value:{
                    item: "",
                    itemFamily: "",
                    itemName: "",
                    xs:true,
                    s:true,
                    m:true,
                    l: true,
                    xl:true,
                    category:0
                }, 
                quantity:{
                    xs:"",
                    s:"",
                    m:"",
                    l:"",
                    xl:""
                },
                factory:""

        }]
        })
        setOrderLineItems(lineItemArray)
        setValue(lineItemArray)
    }

    const handleCloseAutocomplete = () => {
        toggleOpen(false)
    }

    const handleSubmitNewStyle = async() => {
        const payload = {...dialogValue}
        await dispatch(createItem(payload))
        const newList = await dispatch(getItems())
        setProductList(newList.allItems)
        // initialLoad()
        setDialogValue({
            item: "",
            itemFamily: "",
            itemName: "",
            xs:true,
            s:true,
            m:true,
            l: true,
            xl:true,
            category:0
        })
        toggleOpen(false)

    }

  

    useEffect(()=>{
        initialLoad()
    },[props])

    const handleClose = () => {
        props.openCreateCustomerOrder(false)
    }

    const handleSubmit = () => {
        console.log("orderLineItems:    ", orderLineItems)
        console.log("These are values:    ", value)
        console.log("These are customerInfo:    ", customerInfo)
    }

    const handleFlattenOrder = () => {
        const flatArr = []
        const factoryListArr = []
        const factorypoarr = []
        let indexoffset = 0
        orderLineItems.forEach((ele) => {
            ele.forEach((ele2, index)=>{
                if(ele2.value.item == "") return
                flatArr.push(ele2)
                if(factoryListArr.indexOf(ele2.factory) == -1){
                    factoryListArr.push(ele2.factory)
                    // let firstPOString = `9${format(new Date(),'yyMMddyy')}`
                    // let poDateOffset = factoryListArr.length
                    // const currVendorInfo = vendorList.find(x => x.id == ele2.factory)

                    // if(Array.isArray(vendorOrders)){
                    //     const poNums = vendorOrders.map((ele)=>{
                    //         return ele.factoryPO
                    //     })
                    //     while(poNums.indexOf(firstPOString) > -1){
                    //         let nextDate = addYears(new Date(), poDateOffset + 1)
                    //         poDateOffset = (parseInt(poDateOffset))
                    //         firstPOString = `9${format(new Date(),'yy')}${format(new Date(nextDate),'MMddyy')}`
                    //     }
                    //     if(factoryListArr.length > 0){
                    //         let newPODateOffset = (parseInt(poDateOffset) + parseInt(indexoffset))
                    //         let nextDate = addYears(new Date(), newPODateOffset)
                    //         firstPOString = `9${format(new Date(),'yy')}${format(new Date(nextDate),'MMddyy')}`
                    //     }
                    //     indexoffset = (parseInt(indexoffset) + 1)
                    //     factorypoarr.push({factoryPO: firstPOString, factoryId: ele2.factory, info:currVendorInfo})
                    // }
                }
            })
        })
        // console.log("this is factoryPOorderinfo:   ", factoryOrderInfo)
        // setFactoryOrderInfo([...factorypoarr])
        setFlatLineItem(flatArr)
        setSelectedFactories([...factoryListArr])
    }

    const handleNextStep = () => {
        setStep(step+1)
    }

    const handlePreviousStep = () => {
        if(step ==1) return
        setStep(step-1)
    }

    const handleUpdateItemType= (isBikini, index, index2) => {
        // console.log("This is handleUpdateValue:      ",isBikini, index, index2)
        if(isBikini){
            // console.log("This is handleUpdateValue orderLineItems1:      ",orderLineItems, orderLineItems[index], orderLineItems[index][index2])
            if(orderLineItems[index].length == 1){
                const cloneEle = [...orderLineItems]
                cloneEle[index]= [{...cloneEle[index][index2]}, {...cloneEle[index][index2]}]
                // console.log("This is handleUpdateValue cloneEle1:      ",cloneEle)
                setOrderLineItems([...cloneEle])
                setValue([...cloneEle])
            }
        } 
        if(!isBikini){
            // console.log("This is handleUpdateValue orderLineItems2:      ",orderLineItems, orderLineItems[index], orderLineItems[index][index2])
            if(orderLineItems[index].length == 2){
                const cloneEle = [...orderLineItems]
                cloneEle[index] = [{...cloneEle[index][0]}]
                // console.log("This is handleUpdateValue cloneEle2:      ",cloneEle)
                setOrderLineItems([...cloneEle])
                setValue([...cloneEle])
            }
        }
    }

    const handleUpdateValue= (input, index, index2) => {
        // console.log("This is handleUpdateValue:      ",isBikini, index, index2)
            // console.log("This is handleUpdateValue orderLineItems1:      ",orderLineItems, orderLineItems[index], orderLineItems[index][index2])
        const cloneItemsArr= [...value]
        const cloneEle = {...cloneItemsArr[index][index2]}
        cloneEle.value = input
        cloneItemsArr[index][index2] = cloneEle
        // console.log("This is handleUpdateValue cloneEle1:      ",cloneEle, cloneItemsArr)
        setValue([...cloneItemsArr])
    }

    const handleUpdateQuantity= (size, input, index, index2) => {
        // console.log("This is handleUpdateValue:      ",isBikini, index, index2)
            // console.log("This is handleUpdateValue orderLineItems1:      ",orderLineItems, orderLineItems[index], orderLineItems[index][index2])
        const cloneItemsArr= [...value]
        const cloneEle = {...cloneItemsArr[index][index2]}
        cloneEle.quantity = {...cloneEle.quantity, [size]: input}
        // cloneEle.quantity = {...cloneEle.quanity, }
        cloneItemsArr[index][index2] = cloneEle
        // console.log("This is handleUpdateQuantity cloneEle1:      ",cloneEle.quantity[size], cloneItemsArr, size, input, )
        setValue([...cloneItemsArr])
    }

    const handleUpdateFactory= (input, index, index2) => {
        // console.log("This is handleUpdateValue:      ",isBikini, index, index2)
            // console.log("This is handleUpdateValue orderLineItems1:      ",orderLineItems, orderLineItems[index], orderLineItems[index][index2])
        const cloneItemsArr= [...value]
        const cloneEle = {...cloneItemsArr[index][index2]}
        cloneEle.factory = input
        // cloneEle.quantity = {...cloneEle.quanity, }
        cloneItemsArr[index][index2] = cloneEle
        setValue([...cloneItemsArr])
    }

    const handleFactoryOrderInput = (input, index, factory, info) => {
        console.log("handleFactoryOrderInput")
        const cloneArr= [...factoryOrderInfo]
        cloneArr[index] = {factoryId: factory, factoryPO: input, info}
        setFactoryOrderInfo([...cloneArr])
    }
    
    const handleSubmitItAll = async() =>{

        // Step 1: Add shipping address to db
        
        const contactInfoPayload = {
            address1: currInput.address1, 
            address2: currInput.address2 ,
            city: currInput.city ,
            state: currInput.state,
            zipCode: currInput.zipCode ,
            country: currInput.country,
            firstName: currInput.customerFirstName,
            lastName: currInput.customerLastName,
        }
        const newContactInfo = await dispatch(createContactInfo(contactInfoPayload))
        // console.log("this is newContactInfo:   ", newContactInfo)

        // Step 2: Create customer order
        const customerOrderPayload = {
            shopifyId: `${currInput.id}`,
            shopifyCustomerId: `${currInput.shopifyCustomerId}`,
            shipToCustomer:isDropShip,
            shopifyOrderNumber:`${currInput.shopifyOrderNumber}`,
            shipToAddress: newContactInfo.id, 
            customerFirstName: currInput.customerFirstName,
            customerLastName: currInput.customerLastName,
            isActive:true,
            isCancelled:false,
            isReceived:false,
            status:"PO Pending",
            requiresApproval:false
        }
        const newCustomerOrder = await dispatch(createCustomerOrder(customerOrderPayload))
        // console.log("this is newCustomerOrder:    ", newCustomerOrder)


        // Step 3: Create factory orders and line Items
        let factoryOrderInfoArr = []
        factoryOrderInfo.forEach(async(currele)=>{
            let totalCostLocalCurrency = 0
            let totalCostUSDCurrency = 0
            let factoryOrderObj = {
                factory: currele.factoryId,
                factoryPO: currele.factoryPO,
                status:"Pending",
                isActive:true,
                isShipped:false,
                isPending:false,
                customerOrder: newCustomerOrder.id
            }
            // console.log("this is factiory obj:    ", factoryOrderObj)
            const curreleOrder = await dispatch(createVendorOrder(factoryOrderObj))
            // console.log("this is curreleOrder:    ", curreleOrder)
            let lineItemArr = []
            console.log("This is the factoryOrderInfo on 395 ", factoryOrderInfo)
            const pricingArr = currele.info.Pricings
            flatLineItem.forEach(async(currele2) => {
                // console.log("this is currele2:   ", currele2)
                
                if(currele2.factory != currele.factoryId){
                    return
                }
                const priceObj = pricingArr.find(x => x.category == currele2.value.category)
                
                const xsSize = parseInt(currele2.quantity.xs) || 0
                const sSize = parseInt(currele2.quantity.s) || 0
                const mSize = parseInt(currele2.quantity.m) || 0
                const lSize = parseInt(currele2.quantity.l) || 0
                const xlSize = parseInt(currele2.quantity.xl) || 0
                const total = xsSize + sSize + mSize + lSize + xlSize
                const unitCostLocal = parseFloat((priceObj.pricingLocal * total)).toFixed(2)
                const unitCostUSD = parseFloat((priceObj.pricingLocal * total)/exchangeRate.BGN).toFixed(2)
                const totalLocalCurrency = parseFloat((priceObj.pricingLocal * total)).toFixed(2)
                const totalUSDCurrency = parseFloat((priceObj.pricingLocal * total)/exchangeRate.BGN).toFixed(2)
                totalCostLocalCurrency = Number(parseFloat(totalCostLocalCurrency).toFixed(2)) + parseFloat(totalLocalCurrency)
                totalCostUSDCurrency = Number(parseFloat(totalCostUSDCurrency).toFixed(2)) + parseFloat(totalUSDCurrency)

                
                let lineItemObj = {
                    item:currele2.value.id,
                    factoryOrder:curreleOrder.id,
                    quantity:total,
                    xs:xsSize,
                    s:sSize,
                    m:mSize,
                    l:lSize,
                    xl:xlSize,
                    status:"Pending",
                    isCompleted:false,
                    isShipped:false,
                    isActive:true,
                    shopifyId:`${currele2.id}`,
                    unitCostLocal,
                    unitCostUSD
                    
                }
                const createLineNewLineItem = await dispatch(createLineItem(lineItemObj))
                // console.log("this is createLineNewLineItem:    ", createLineNewLineItem)
            })

            const updateFactoryTotalPrice = await dispatch(updateVendorOrderCost({factory_order_id:curreleOrder.id, localTotal:totalCostLocalCurrency, usdTotal: totalCostUSDCurrency }))
            
        })
        
       handleClose() 
        
    }

    return(
        <Grid container >
            <ThemeProvider theme={theme}> 
                <Paper sx={{width:"100%"}}>
                    <Grid container  >
                        <Grid item xs={12} sx={{backgroundColor:"#14213D", p:2}}> 
                            <Typography variant="h5">#{customerInfo.shopifyOrderNumber}: {customerInfo.customerFirstName} {customerInfo.customerLastName}</Typography>
                        </Grid>
                        {/* Step 1 */}
                        <Grid container sx={{p:4, pl:6}} spacing={3} >
                            <Collapse in={step == 1}>
                            <Grid container sx={{p:2}} spacing={3}>
                                <Grid container item xs={12} alignItems="center">
                                    <Grid item xs={12} container  sx={{pr:2}}>
                                        <Typography variant="h6">General Info</Typography>
                                    </Grid>
                                <Grid container item xs={6} alignItems="center">
                                    <Grid item xs={6}>
                                        <FormGroup>
                                        <FormControlLabel 
                                            control={<Switch color='switch' checked={isDropShip} onChange={()=>setIsDropShip(!isDropShip)} />}
                                            label='Ships to Customer'
                                        />
                                        </FormGroup>
                                        </Grid>
                                    </Grid>
                                    {isDropShip ? 
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Typography variant="body1" sx={{fontWeight:600}}>{customerInfo?.customerFirstName} {customerInfo?.customerLastName}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body1" >{customerInfo?.address1}</Typography>
                                            </Grid>
                                            {customerInfo.address2 ?<Grid item xs={12}> <Typography variant="body1" >{customerInfo?.address2}</Typography></Grid> : null}
                                            <Grid item xs={12}>
                                                <Typography variant="body1" >{customerInfo?.city}, {customerInfo?.state} {customerInfo?.zipCode}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body1" >{customerInfo?.country}</Typography>
                                            </Grid>
                                        </Grid> : null
                                    }
                                
                                    
                                </Grid>
                                <Grid container item xs={12} alignItems="center">
                                    <Grid item xs={12} container  sx={{pr:2}}>
                                        <Typography variant="h6">Line Items</Typography>
                                    </Grid>
                                    
                                </Grid>
                                {orderLineItems.map((lineItemArr, index) =>{
                                    //  console.log("this is lineItemm Arr:   ", lineItemArr)
                                    if(value.length == 0){return(null)}
                                    return(
                                        <Grid item container xs={12} key={index}>
                                            <Accordion sx={{width:"100%"}}>
                                                <AccordionSummary key={index} expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant='body1'>{lineItemArr[0].sku}: {lineItemArr[0].name}</Typography>
                                                </AccordionSummary>
                                                {lineItemArr.map((ele, index2) => {
                                                    return(
                                                        <AccordionDetails>
                                                            {index2 == 0 ?
                                                                <Grid container alignItems='center' sx={{pb:2}}>
                                                                <Grid item xs={'auto'}>
                                                                    <Switch color='switch' onChange={(e)=>handleUpdateItemType(e.target.checked, index, index2)} />
                                                                </Grid>                                                
                                                                <Grid item xs={'auto'}>
                                                                    <Typography variant='body1'>Bikini</Typography>
                                                                </Grid>                                                
                                                            </Grid> : null}
                                                            <Grid container item xs={12} spacing={2}>
                                                                <Grid item xs={4} container justifyContent='center'>
                                                                    {index2 === 0 ?<Grid item xs={"auto"}> <Typography variant="h6">Style</Typography></Grid> : null}
                                                                    <Autocomplete
                                                                        value={value[index][index2].value}
                                                                        onChange={(event, newValue) => {
                                                                            if(typeof newValue === 'string'){
                                                                                console.log("this is newvalue 1 area:    ", newValue)
                                                                                setTimeout(()=> {
                                                                                    toggleOpen(true)
                                                                                    handleUpdateValue({
                                                                                        item: newValue,
                                                                                        itemFamily: "",
                                                                                        itemName: "",
                                                                                        xs:true,
                                                                                        s:true,
                                                                                        m:true,
                                                                                        l: true,
                                                                                        xl:true,
                                                                                        category:0
                                                                                    }, index, index2)
                                                                                })
                                                                            } else if (newValue && newValue.inputValue){
                                                                                console.log("this is newvalue 2 area:    ", newValue)
                                                                                toggleOpen(true)
                                                                                setDialogValue({
                                                                                    item: newValue.inputValue,
                                                                                        itemFamily: "",
                                                                                        itemName: "",
                                                                                        xs:true,
                                                                                        s:true,
                                                                                        m:true,
                                                                                        l: true,
                                                                                        xl:true,
                                                                                        category:0
                                                                                    })
                                                                                } else {
                                                                                console.log("this is newvalue 3 area:    ", newValue)
                                                                                const valueClone = [...value]
                                                                                const valueEle = valueClone[index][index2].value = newValue
                                                                                setValue([...valueClone])
                                                                            }
                                                                        }}
                                                                        filterOptions={(options, params) => {
                                                                            const filtered = filter(options, params)
                                                                            if(params.inputValue !== ""){
                                                                                // console.log("this is options, and params:   ", options, params)
                                                                                filtered.push({
                                                                                    inputValue:params.inputValue,
                                                                                    title: `Add "${params.inputValue}"`,
                                                                                    item: `Add "${params.inputValue}"`
                                                                                })
                                                                            }
                                                                            return filtered
                                                                        }}
                                                                        id="free-solo-dialog-demo"
                                                                        options={productList}
                                                                        getOptionLabel={(option)=>{
                                                                            // console.log("this is option on line 257:     ", option)
                                                                            if(typeof option === 'string'){
                                                                                return option
                                                                            }
                                                                            return `${option.item}  ${option.itemName == null ? "" : option.itemName}`
                                                                        }}
                                                                        selectOnFocus
                                                                        clearOnBlur
                                                                        handleHomeEndKeys
                                                                        // renderOption={(props, option)=><li {...props}>{option.item}</li>}
                                                                        sx={{width:'100%'}}
                                                                        freeSolo
                                                                        renderInput={(params)=> <TextField {...params} />}
                                                                        // renderInput={(params)=> <TextField {...params} label="Style Number"/>}
                                                                    />
                                                                    <Dialog open={open} onClose={handleCloseAutocomplete} fullWidth maxWidth="md" sx={{mb:"50vh"}}>
                                                                    <Paper sx={{width:"100%"}}>
                                                                        <Grid container sx={{width:"100%"}}>
                                                                            <Grid item xs={12} sx={{backgroundColor:"#14213D", p:2}}> 
                                                                                <Typography variant="h5">Add New Style</Typography>
                                                                            </Grid>
                                                                            <Grid container sx={{p:2}} spacing={2} >
                                                                                <Grid item xs={3} container justifyContent='center'>
                                                                                    <Typography variant='h6'>Style Num</Typography>
                                                                                    <TextField fullWidth autoFocus id="styleNum" value={dialogValue.item} onChange={(e)=>setDialogValue({...dialogValue, item: e.target.value})} />
                                                                                </Grid>
                                                                                <Grid item xs={6} container justifyContent='center'>
                                                                                    <Typography variant='h6'>Name</Typography>
                                                                                    <TextField fullWidth autoFocus id="styleNum" value={dialogValue.itemName} onChange={(e)=>setDialogValue({...dialogValue, itemName: e.target.value})} />
                                                                                </Grid>
                                                                                <Grid item xs={3} container justifyContent='center'>
                                                                                    <Typography variant='h6'>Category</Typography>
                                                                                    <Select fullWidth value={dialogValue.category} onChange={(e)=>setDialogValue({...dialogValue, category: e.target.value})}>
                                                                                        {categoryList.map((ele)=>{
                                                                                            return(
                                                                                                <MenuItem value={ele.id}>{ele.name}</MenuItem>
                                                                                            )
                                                                                        })}
                                                                                    </Select>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Grid container justifyContent="center">
                                                                            <Grid item xs={3} sx={{p:2}}>
                                                                                <Button color="button2" variant="outlined" onClick={()=>toggleOpen(false)} fullWidth>close</Button>
                                                                            </Grid>
                                                                            <Grid item xs={3} sx={{p:2}}>
                                                                            <Button color="primary" style={{backgroundColor:"#FCA311"}} variant="contained" onClick={handleSubmitNewStyle} fullWidth>Add Style</Button>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Paper>
                                                                    </Dialog>
                                                                </Grid>
                                                            <Grid item xs={4} container justifyContent='space-around' >
                                                                <Grid container item xs={2} justifyContent='center'>
                                                                    {index2 === 0 ?<Grid item xs={1}> <Typography  variant="h6">XS</Typography></Grid> : null}
                                                                    <TextField fullWidth variant="outlined" value={value[index][index2].quantity.xs} onChange={(e)=>handleUpdateQuantity("xs", e.target.value, index, index2)}/>
                                                                </Grid>
                                                                <Grid container item xs={2} justifyContent='center'>
                                                                    {index2 === 0 ?<Grid item xs={1}> <Typography  variant="h6">S</Typography></Grid> : null}
                                                                    <TextField fullWidth variant="outlined" value={value[index][index2].quantity.s} onChange={(e)=>handleUpdateQuantity("s", e.target.value, index, index2)}/>
                                                                </Grid>
                                                                <Grid container item xs={2} justifyContent='center'>
                                                                    {index2 === 0 ?<Grid item xs={1}> <Typography  variant="h6">M</Typography></Grid> : null}
                                                                    <TextField fullWidth variant="outlined" value={value[index][index2].quantity.m} onChange={(e)=>handleUpdateQuantity("m", e.target.value, index, index2)}/>
                                                                </Grid>
                                                                <Grid container item xs={2} justifyContent='center'>
                                                                    {index2 === 0 ?<Grid item xs={1}> <Typography  variant="h6">L</Typography></Grid> : null}
                                                                    <TextField fullWidth variant="outlined" value={value[index][index2].quantity.l} onChange={(e)=>handleUpdateQuantity("l", e.target.value, index, index2)}/>
                                                                </Grid>
                                                                <Grid container item xs={2} justifyContent='center'>
                                                                    {index2 === 0 ?<Grid item xs={1}> <Typography  variant="h6">XL</Typography></Grid> : null}
                                                                    <TextField fullWidth variant="outlined" value={value[index][index2].quantity.xl} onChange={(e)=>handleUpdateQuantity("xl", e.target.value, index, index2)}/>
                                                                </Grid>
                                                                {/* <Grid container item xs={2} justifyContent='center'>
                                                                    {index2 === 0 ?<Grid item xs={"auto"}> <Typography variant="h6">Total</Typography></Grid> : null}
                                                                    <TextField fullWidth variant="outlined"/>
                                                                </Grid> */}
                                                            </Grid>
                                                            <Grid container item xs={4}>
                                                                {index2 === 0 ?<Grid item xs={"auto"}> <Typography  variant="h6">Factory</Typography></Grid> : null}
                                                                <Select fullWidth value={value[index][index2].factory} onChange={(e)=> handleUpdateFactory(e.target.value, index, index2)} >
                                                                    {vendorList.map((vendorele)=> {
                                                                        const pricingExists = vendorele.Pricings.find(x => x.category == ele?.value?.category)
                                                                        // console.log("this is vendor name:   ", pricingExists)
                                                                        if(pricingExists == null){
                                                                            return(
                                                                                <MenuItem disabled value={vendorele.id}>{vendorele.name}</MenuItem>
                                                                            )
                                                                        }
                                                                        return(
                                                                            <MenuItem value={vendorele.id}>{vendorele.name}</MenuItem>
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </Grid>
                                                            </Grid>
                                                        </AccordionDetails>
                                                    )
                                                    })}
                                            </Accordion>
                                        </Grid>
                                    )
                                } )}

                            {/* Bottom Buttons */}
                            <Grid container justifyContent="center">
                                <Grid item xs={3} sx={{p:2}}>
                                    <Button color="button2" variant="outlined" onClick={handleClose} fullWidth>close</Button>
                                </Grid>
                                <Grid item xs={3} sx={{p:2}}>
                                <Button color="primary" style={{backgroundColor:"#FCA311"}} variant="contained" onClick={()=>{handleNextStep(); handleFlattenOrder()}} fullWidth>Next</Button>
                                </Grid>
                            </Grid>
                            </Grid>
                        </Collapse>
                        <Collapse in={step == 2}>
                            <Grid container sx={{p:2}} spacing={3}>
                                {/* <Grid container item xs={12}>
                                    <Grid item xs={12} container  sx={{pr:2}}>
                                        <Typography variant="h6">Factory Order</Typography>
                                    </Grid>
                                </Grid> */}
                                <Grid container item xs={12}>
                                {selectedFactories.map((eleFactory, factoryIndex)=>{
                                    const currVendorInfo = vendorList.find(x => x.id == eleFactory)
                                    // console.log("this is currVendorInfo:   ",currVendorInfo, eleFactory)
                                    const factoryID = currVendorInfo.id
                                    
                            console.log("this is firstPOString:  ", factoryOrderInfo)
                                    
                                    return(
                                        <Grid container sx={{p:2}} spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography variant="h6">{currVendorInfo?.name}</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography variant="body1" sx={{fontWeight:600}} >PO Number</Typography>
                                                <TextField error={usedPONums.indexOf(factoryOrderInfo[factoryIndex]?.factoryPO) > -1} value={factoryOrderInfo[factoryIndex]?.factoryPO } onChange={(e)=>handleFactoryOrderInput(e.target.value, factoryIndex, factoryID, currVendorInfo)} fullWidth variant="outlined" />
                                            </Grid>


                                        {flatLineItem.map((ele, index)=>{

                                            if(factoryID != ele.factory){
                                                return(null)
                                            }


                                            const itemFactoryPricing = currVendorInfo.Pricings.find(x => x.category == ele.value?.category)
                                            const itemPrice = itemFactoryPricing?.pricingLocal
                                            console.log("This is item factory price:    ",itemFactoryPricing, itemPrice)



                                            const xsSize = parseInt(ele.quantity.xs) || 0
                                            const sSize = parseInt(ele.quantity.s) || 0
                                            const mSize = parseInt(ele.quantity.m) || 0
                                            const lSize = parseInt(ele.quantity.l) || 0
                                            const xlSize = parseInt(ele.quantity.xl) || 0
                                            const total = xsSize + sSize + mSize + lSize + xlSize
                                            return(
                                                <Grid container item xs={12} spacing={2}>
                                                    <Grid item xs={4} container>
                                                        {index == 0 ? <Grid item xs={12}> <Typography variant="body1" sx={{fontWeight:600}}>Style</Typography></Grid> : null}
                                                        <Grid item xs={12}>
                                                            <Typography variant="body1">{ele?.value?.item} - {ele?.value?.itemName}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={8} container justifyContent='space-around'>
                                                        <Grid item xs={1} container>
                                                            {index == 0 ? <Grid item xs={12}> <Typography variant="body1" sx={{fontWeight:600}}>XS</Typography></Grid> : null}
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1">{xsSize}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={1} container>
                                                            {index == 0 ? <Grid item xs={12}> <Typography variant="body1" sx={{fontWeight:600}}>S</Typography></Grid> : null}
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1">{sSize}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={1} container>
                                                            {index == 0 ? <Grid item xs={12}> <Typography variant="body1" sx={{fontWeight:600}}>M</Typography></Grid> : null}
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1">{mSize}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={1} container>
                                                            {index == 0 ? <Grid item xs={12}> <Typography variant="body1" sx={{fontWeight:600}}>L</Typography></Grid> : null}
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1">{lSize}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={1} container>
                                                            {index == 0 ? <Grid item xs={12}> <Typography variant="body1" sx={{fontWeight:600}}>XL</Typography></Grid> : null}
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1">{xlSize}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={1} container>
                                                            {index == 0 ? <Grid item xs={12}> <Typography variant="body1" sx={{fontWeight:600}}>TOTAL</Typography></Grid> : null}
                                                            <Grid item xs={12}>
                                                                <Typography  variant="body1">{total}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={1} container>
                                                            {index == 0 ? <Grid item xs={12}> <Typography variant="body1" sx={{fontWeight:600}}>Unit</Typography></Grid> : null}
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1">{itemPrice} Лв.</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={1} container>
                                                            {index == 0 ? <Grid item xs={12}> <Typography variant="body1" sx={{fontWeight:600}}>Total</Typography></Grid> : null}
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1">{`${itemPrice * total} Лв.`}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item xs={1} container>
                                                            {index == 0 ? <Grid item xs={12}> <Typography variant="body1" sx={{fontWeight:600}}>Total</Typography></Grid> : null}
                                                            <Grid item xs={12}>
                                                                <Typography variant="body1">{`$${parseFloat((itemPrice * total)/exchangeRate.BGN).toFixed(2)}`}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                )})}
                                </Grid>

                                {/* Bottom Buttons */}
                                <Grid container justifyContent="center">
                                    <Grid item xs={3} sx={{p:2}}>
                                        <Button color="button2" variant="outlined" onClick={handlePreviousStep} fullWidth>Back</Button>
                                    </Grid>
                                    <Grid item xs={3} sx={{p:2}}>
                                    <Button color="primary" style={{backgroundColor:"#FCA311"}} variant="contained" onClick={handleSubmitItAll} fullWidth>Submit</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Collapse>
                        </Grid>
                    </Grid>

                    {/* Bottom Buttons */}
                    {/* <Grid container justifyContent="center">
                        <Grid item xs={3} sx={{p:2}}>
                            <Button color="button2" variant="outlined" onClick={handleClose} fullWidth>close</Button>
                        </Grid>
                        <Grid item xs={3} sx={{p:2}}>
                        <Button color="primary" style={{backgroundColor:"#FCA311"}} variant="contained" onClick={handleNextStep} fullWidth>Next</Button>
                        </Grid>
                    </Grid> */}

                </Paper>
            </ThemeProvider>
        </Grid>
    )
}

export default CreateCustomerOrderModal