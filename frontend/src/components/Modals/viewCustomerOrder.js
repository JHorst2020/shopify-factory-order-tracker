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

import {searchForLineItems} from "../../store/vendors"

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

const ViewCustomerOrderModal = (props) => {
    const currInput = props.props
    // console.log("these are the customerprops :    ", props)
    const dispatch = useDispatch()

    const shopifyInfo = useSelector(state => state.orders.shopifyOrders)
    const [customerInfo, setCustomerInfo] = useState({})
    const [orderDate, setOrderDate] = useState("")
    const [unfilArr, setUnfilArr] = useState([])
    const [filArr, setFilArr] = useState([])
    const [submittedOrders, setSubmittedOrders] = useState([])

    const initialLoad = async() => {
        let shopifyLineItemIdArr = []
        currInput.unfulfilledArray.forEach((ele)=>{
            shopifyLineItemIdArr.push({
                shopifyId: `${ele.id}`
            })
        })
        const customerOrderedItems = await(dispatch(searchForLineItems({lineItems:shopifyLineItemIdArr})))
        setSubmittedOrders(customerOrderedItems)
        setUnfilArr(currInput.unfulfilledArray)
        setFilArr(currInput.fulfilledArray)
        setOrderDate(currInput.orderDate)
        setCustomerInfo(currInput)
    }

    useEffect(()=>{
        initialLoad()
    },[props])

    const handleCloseModal = () => {
        props.setOpenViewOrder(false)
    }

    const handleOpenCreateNewOrder = () => {
        props.openCreateCustomerOrder(true)
        handleCloseModal()
    }


    return(
        <Grid container >
            <ThemeProvider theme={theme}> 
                <Paper sx={{width:"100%"}}>
                    <Grid container  >
                        <Grid item xs={12} sx={{backgroundColor:"#14213D", p:2}}> 
                            <Typography variant="h5">Customer Order</Typography>
                        </Grid>

                        <Grid container sx={{p:2}} spacing={3}>
                        <Grid container item xs={6} alignItems="center">
                            <Grid item xs={12} container  sx={{pr:2}}>
                                <Typography variant="body1">Name:</Typography>
                                <Typography variant="body1" sx={{fontWeight:600, pl:1}}>{customerInfo.customerFirstName} {customerInfo.customerLastName}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container item xs={6} alignItems="center">
                            <Grid item xs={12} container  sx={{pr:2}}>
                                <Typography variant="body1">Order Date:</Typography>
                                <Typography variant="body1" sx={{fontWeight:600, pl:1}}>{orderDate} </Typography>
                            </Grid>
                        </Grid>
                        <Grid container item xs={6} alignItems="center">
                            <Grid item xs={12} container  sx={{pr:2}}>
                                <Typography variant="body1" >Location:</Typography>
                                <Typography variant="body1" sx={{fontWeight:600, pl:1}}>{customerInfo.city}, {customerInfo.state} {customerInfo.country} </Typography>
                            </Grid>
                            <Grid item xs={6}>
                            </Grid>
                        </Grid>
                        <Grid container item xs={6} alignItems="center">
                            <Grid item xs={12} container  sx={{pr:2}}>
                                <Typography variant="body1">Shopify Order:</Typography>
                                <Typography variant="body1" sx={{fontWeight:600, pl:1}}>#{customerInfo.shopifyOrderNumber} </Typography>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} alignItems="center">
                        {unfilArr.length > 0 ?<Grid item xs={4} container  sx={{pr:2}}>
                                <Typography variant="body1">Unfulfilled Items:</Typography>
                            </Grid>: null}
                            {unfilArr.map((ele)=>{
                                const isOrdered = submittedOrders.find(x => x.shopifyId == ele.id)
                                console.log("ele:  ", isOrdered)

                                return(
                                    <Grid container item xs={12} sx={{p:1}}>
                                        <Grid item xs={'auto'}>
                                            <Typography variant="body1" sx={{fontWeight:600}}>{ele.sku}: {ele.name} </Typography>
                                        </Grid>
                                        {isOrdered != null ? 
                                        <Grid item xs={'auto'}>
                                            <Typography variant="body1" sx={{fontStyle:"italic"}}>- Factory Order: {isOrdered.status} </Typography>
                                        </Grid>: null
                                        }
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <Grid container item xs={12} alignItems="center">
                            {filArr.length > 0 ?<Grid item xs={4} container  sx={{pr:2}}>
                                <Typography variant="body1">Fulfilled Items:</Typography>
                            </Grid>: null}
                            {filArr.map((ele)=>{
                                return(
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{fontWeight:600}}>{ele.sku}: {ele.name} </Typography>
                                    </Grid>
                                )
                            })}
                        </Grid>
                        </Grid>

                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid item xs={3} sx={{p:2}}>
                            <Button color="button2" variant="outlined" onClick={handleCloseModal} fullWidth>close</Button>
                        </Grid>
                        <Grid item xs={3} sx={{p:2}}>
                        <Button color="primary" style={{backgroundColor:"#FCA311"}} variant="contained" onClick={handleOpenCreateNewOrder} fullWidth>Create Order</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </ThemeProvider>
        </Grid>
    )
}

export default ViewCustomerOrderModal