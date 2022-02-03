import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useHistory} from "react-router-dom"

//? Components
import FactoryOrderModal from "../Modals/factoryOrderModal"

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


//? Redux Store
import {getUnfulfilledShopifyOrders} from"../../store/orders"
import {getAllVendorOrders} from"../../store/vendors"

const theme = createTheme({
  palette:{
      button: {
          main:'#0091E2',
          light:'#0091E230',
          dark:'#30b5ff',
          contrastText:'white'
      },
  },
  typography: {
      h5: {
          fontWeight: "bold",
          color: "#0091E2"
          // color: "red"
      },
      h6: {
          fontWeight: "bold",
          color: "#0091E2",
      },
      h7: {
          color: "#8F94A4",
          fontWeight: 600,
      },
      body1: {
          color: "rgba(98, 98, 98, 1)",
          // fontWeight: 600,
      },
  },

})

const FactoryOrder = () => {
  const dispatch = useDispatch();
  const history = useHistory()
  const openOrderList = useSelector(state => state.orders.openOrders)
  const shopifyInfo = useSelector(state => state.orders.shopifyOrders)
  const vendorOrders = useSelector(state => state.vendor.orders)
  const [allOrders, setAllOrders]= useState([])
  const [open, setOpen] = useState(false)
  const [modalProps, setModalProps] = useState({})

  const initialLoad = async() => {
    const loadOrders =  await dispatch(getAllVendorOrders())
    // console.log("this is load orders:   ", loadOrders)
    setAllOrders(loadOrders)
    return loadOrders
  }

  useEffect(()=>{
    initialLoad()
  },[])

  const renderCellFormat = (input) => {
    return(
      <Typography sx={{cursor:'pointer'}} variant='body1'>{input}</Typography>
    )
  }

  const shopifyLinkClick = (input) => {
    window.open(`https://dolcessa-swimwear.myshopify.com/admin/orders/${input}`)
  }

  const renderLinkFormat = (input) => {
    return(
      <Typography sx={{cursor:'pointer'}} variant='body1' onClick={()=>shopifyLinkClick(input) }>Link</Typography>
    )
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpenFactoryModal = (input) => {
    setModalProps(input.row)
    setOpen(true)
  }

  const columns = [
    {field:'factoryName', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Factory</Typography>)}, renderCell: (e)=>renderCellFormat(e.row?.Factory?.name) },
    {field:'factoryPO', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Factory PO</Typography>)}, renderCell: (e)=>renderCellFormat(`#${e.row?.factoryPO}`) },
    {field:'ShopifyOrder', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Shopify Order</Typography>)}, renderCell: (e)=>renderCellFormat(e.row?.CustomerOrder?.shopifyOrderNumber == null ? '' : `#${e.row?.CustomerOrder?.shopifyOrderNumber}`) },
    {field:'name', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Customer</Typography>)}, renderCell: (e)=>renderCellFormat(`${e.row?.CustomerOrder?.customerFirstName} ${e.row?.CustomerOrder?.customerLastName}`) },
    {field:'status', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Status</Typography>)}, renderCell: (e)=>renderCellFormat(e.row?.status) },
    // {field:'externalLink', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Shopify</Typography>)}, renderCell: (e)=>renderLinkFormat(e.row?.shopifyId) },
    // {field:'action', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Actions</Typography>)}, renderCell: (e)=>createCustomerOrderFormat(e) },
  ]

  return (
    <Grid container sx={{p:3}}>
     <Grid item xs={12} style={{height:"75vh", width:'100%'}}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{padding:3, backgroundColor:"#E5E5E5"}}>
          <Grid item>
            <Typography variant="h3" sx={{color:"#14213D"}}>Factory Orders</Typography>
          </Grid>
          <Grid item>
            {/* <AddVendor /> */}
          </Grid>
        </Grid>
        <ThemeProvider theme={theme}>
        <DataGrid 
          columns={columns}
          rows={allOrders}
          onCellClick={handleOpenFactoryModal}
          />
          </ThemeProvider>
      </Grid>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" >
        <FactoryOrderModal props={modalProps} closeModal={handleClose} reloadInfo={initialLoad} />
      </Dialog>
    </Grid>
  );
};

export default FactoryOrder;
