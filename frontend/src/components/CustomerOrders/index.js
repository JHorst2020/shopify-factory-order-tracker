import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useHistory} from "react-router-dom"

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

//? Components
import ViewCustomerOrderModal from "../Modals/viewCustomerOrder"
import CreateCustomerOrderModal from "../Modals/createNewCustomerOrder"

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


const CustomerOrder = () => {
  const dispatch = useDispatch();
  const history = useHistory()
  const openOrderList = useSelector(state => state.orders.openOrders)
  const shopifyInfo = useSelector(state => state.orders.shopifyOrders)


  const [openOrders, setOpenOrders] = useState([])

  const [openViewOrder, setOpenViewOrder] = useState(false)
  const [openCreateCustomerOrder, setOpenCreateCustomerOrder]= useState(false)
  const [viewOrderProps, setViewOrderProps] = useState("")


  const initialLoad = async() =>{
    const dbOpenOrders = await dispatch(getUnfulfilledShopifyOrders())
    // console.log("db open orders:   ", dbOpenOrders)
    setOpenOrders(dbOpenOrders)
  }
  useEffect(() => {
    initialLoad()
  }, []);

  const renderCellFormat = (input) => {
    return(
      <Typography sx={{cursor:'pointer'}}  variant='body1'>{input}</Typography>
    )
  }

  const shopifyLinkClick = (input) => {
    window.open(`https://dolcessa-swimwear.myshopify.com/admin/orders/${input}`)
  }

  const renderLinkFormat = (input, orderNum,e) => {
    // console.log("this is the link:   ", e)
    return(
      <Typography sx={{cursor:'pointer'}} variant='body1' onClick={()=>shopifyLinkClick(input) }>{orderNum}</Typography>
    )
  }
  const renderNeedsApprovalFormat = (input) => {
    return(
      <Typography variant='body1' onClick={()=>shopifyLinkClick(input) }></Typography>
    )
  }

  const createNewCustomerOrder = (input) => {
    setViewOrderProps(input.row)
    setOpenCreateCustomerOrder(true)
  }

  const createCustomerOrderFormat = (input) => {

      return(
        <Typography variant='body1' onClick={()=>createNewCustomerOrder(input) }>Create New Order</Typography>
        )
  }

  const handleViewOrderClose = (input) => {
    setOpenViewOrder(false)
  }

  const handleCreateOrderClose = () => {
    setOpenCreateCustomerOrder(false)
  }

  const handleViewCustomerOrder = (input) => {
    // console.log("This is input props:     ", input)
    setViewOrderProps(input.row)
    setOpenViewOrder(true)
  }

  const getTotalLineItemCount = (input) => {
      const currCustomer = shopifyInfo.filter(x => x.id == input.shopifyId)
        let totalCount = currCustomer[0].lineItems.length
        //TODO: error handling
        return(
          renderCellFormat(totalCount)
        )
  }

  const getUnfulfilledLineItemCount = (input) => {
      const currCustomer = shopifyInfo.filter(x => x.id == input.shopifyId)
        if(Array.isArray(currCustomer[0].unfulfilledArray) == false){
          return (renderCellFormat(""))
        }
        let totalCount = currCustomer[0].unfulfilledArray.length
        //TODO: error handling
        return(
          renderCellFormat(totalCount)
        )
  }

  const columns = [
    // {field:'orderNum', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Order</Typography>)}, renderCell: (e)=>renderCellFormat(`#${e.row.shopifyOrderNumber}`) },
    {field:'externalLink', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Shopify</Typography>)}, renderCell: (e)=>renderLinkFormat(e.row.id, `#${e.row.shopifyOrderNumber}`,e) },
    {field:'orderDate', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Order Date</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.orderDate) },
    {field:'name', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Customer</Typography>)}, renderCell: (e)=>renderCellFormat(`${e.row.customerFirstName} ${e.row.customerLastName}`) },
    // {field:'status', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Status</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.status) },
    {field:'unfulfilledLineItems', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Unfulfilled</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.unfulfilledArray.length) },
    {field:'totalItems', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Total Items</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.lineItems.length) },
    // {field:'action', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Actions</Typography>)}, renderCell: (e)=>createCustomerOrderFormat(e) },
  ]

  return (
    <Grid container sx={{p:3}}>
      
      <Grid item xs={12} style={{height:"75vh", width:'100%'}}>
      <Grid container alignItems="center" justifyContent="space-between" sx={{padding:3, backgroundColor:"#E5E5E5"}}>
          <Grid item>
            <Typography variant="h3" sx={{color:"#14213D"}}>Customer Orders</Typography>
          </Grid>
          <Grid item>
            {/* <AddVendor /> */}
          </Grid>
        </Grid>
        <ThemeProvider theme={theme}>
        <DataGrid
          
          columns={columns}
          rows={openOrders}
          onCellClick={(e)=> handleViewCustomerOrder(e)}
          />
          </ThemeProvider>
      </Grid>
      <Dialog open={openViewOrder} onClose={handleViewOrderClose} fullWidth maxWidth='md'>
        <ViewCustomerOrderModal props={viewOrderProps} openCreateCustomerOrder={setOpenCreateCustomerOrder} setOpenViewOrder={setOpenViewOrder} />
      </Dialog>
      <Dialog open={openCreateCustomerOrder} onClose={handleCreateOrderClose}  fullWidth maxWidth='lg'>
        <CreateCustomerOrderModal props={viewOrderProps} openCreateCustomerOrder={setOpenCreateCustomerOrder} />
      </Dialog>
    </Grid>
  );
};

export default CustomerOrder;
