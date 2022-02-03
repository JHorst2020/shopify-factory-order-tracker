import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useHistory} from "react-router-dom"
import { format, compareAsc, addDays } from 'date-fns'
import { jsPDF } from "jspdf";
import {htmlPDFNewTab, htmlPDFSaveFile, htmlPDFBase64} from "../Files/htmlPDF"

import DolcessaLogo from "./DolcessaLogo.png"



//? Material UI
import {Grid, Dialog, TextField, Select, Checkbox, FormGroup, FormControlLabel, InputAdornment, Switch, Collapse, Icon} from "@mui/material"
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
import { createTheme, ThemeProvider } from '@mui/material/styles'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

//? Redux Store
import {getBGNExchangeRate, updateVendorPricing, createVendorPricing, getVendorPricing} from "../../store/vendors" 
import {getItems} from "../../store/items"
import {getCustomerAddress} from "../../store/customers"

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

// const PackingList = (customerAddress, lineItems, note, shopifyOrderNum) => {
const FactoryPO = (props) => {
  // console.log("this is props:   ", props)
  const lineItems = props.items
  const shipTo = props.shipTo
  const factoryInfo = props.factoryInformation
  const itemName = props.allItems

  
    const shopifyOrderNum = props.orderNumber
    
    const shop = {
        name: `Katya Leoncio`,
        address1: '6551 S Las Vegas Blvd ',
        address2: 'Suite 147',
        city: 'Las Vegas',
        state: 'NV',
        zipCode: '89118',
        country: 'USA',
        email:"info@mydolcessa.com",
        phone:"702-842-4115"
    }
 
    const today = format(new Date(), 'MM/dd/yyyy')
    const orderDate = format(new Date(factoryInfo.poDate), 'dd MMM yyyy')
    const orderDatePlusWeek = format(addDays(new Date(factoryInfo.poDate), 7), 'dd MMM yyyy')
    // console.log("orderDatePlus Week:   ", orderDatePlusWeek, orderDate)

    const [open, setOpen] = useState(false)

    const renderCellFormat = (input) => {
      return(
        <Grid item container xs={12} justifyContent='center'>
          <Typography sx={{fontSize:12}} variant='body1'>{input}</Typography>
        </Grid>
      )
    }

    const renderSKUFormat = (input) => {
      const currItem = itemName.find(x => x.id == input )
      return(
        <Grid item container xs={12} justifyContent='center'>
          <Typography sx={{fontSize:12}} variant='body1'>{currItem?.item}</Typography>
        </Grid>
      )
    }

    const renderNameFormat = (input) => {
      const currItem = itemName.find(x => x.id == input )

      return(
        <Typography sx={{fontSize:12}} variant='body1'>{currItem?.itemName}</Typography>
      )
    }

    const renderTotalCellFormat = (unitCost, quantity) => {
        const total = parseFloat(unitCost).toFixed(2) * parseInt(quantity)
        const totalFormat = parseFloat(total)
      return(
        <Grid item container xs={12} justifyContent='center'>
          <Typography sx={{fontSize:12}} variant='body1'>Лв{totalFormat}</Typography>
        </Grid>
      )
    }

    const columns = [
        {field:'sku', width:50, headerAlign:'center', renderHeader:()=>{return(<Typography sx={{fontSize:12}} variant='h7'>SKU</Typography>)}, renderCell: (e)=>renderSKUFormat(e.row.item) },
        {field:'name', flex:1, headerAlign:'center', renderHeader:()=>{return(<Typography sx={{fontSize:12}} variant='h7'>Quantity</Typography>)}, renderCell: (e)=>renderNameFormat(e.row.item) },
        {field:'xs', width:25, headerAlign:'center', renderHeader:()=>{return(<Typography sx={{fontSize:12}} variant='h7'>XS</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.xs) },
        {field:'s', width:25, headerAlign:'center', renderHeader:()=>{return(<Typography sx={{fontSize:12}} variant='h7'>S</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.s) },
        {field:'m', width:25, headerAlign:'center', renderHeader:()=>{return(<Typography sx={{fontSize:12}} variant='h7'>M</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.m) },
        {field:'l', width:25, headerAlign:'center', renderHeader:()=>{return(<Typography sx={{fontSize:12}} variant='h7'>L</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.l) },
        {field:'xl', width:25, headerAlign:'center', renderHeader:()=>{return(<Typography sx={{fontSize:12}} variant='h7'>XL</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.xl) },
        {field:'quantity', width:75, headerAlign:'center', renderHeader:()=>{return(<Typography sx={{fontSize:12}} variant='h7'>Total</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.quantity)},
        {field:'unitCost', width:75, headerAlign:'center', renderHeader:()=>{return(<Typography sx={{fontSize:12}} variant='h7'>Unit Cost</Typography>)}, renderCell: (e)=>renderCellFormat(`Лв${parseInt(e.row.unitCostLocal)}`)},
        {field:'totalCost', width:75, headerAlign:'center', renderHeader:()=>{return(<Typography sx={{fontSize:12}} variant='h7'>Total Cost</Typography>)}, renderCell: (e)=>renderTotalCellFormat(e.row.unitCostLocal, e.row.quantity)},
    ]
    
    const handleView = async() => {
      const getElement = await document.getElementById("factory-purchase-order")
      console.log("getElement:   ", getElement)
      htmlPDFNewTab(getElement, `Factory PO#${shopifyOrderNum} - Packing List`)
    }
    const handleDownload = async() => {
      const getElement = await document.getElementById("factory-purchase-order")
      htmlPDFSaveFile(getElement, `Factory PO#${shopifyOrderNum} - Packing List`)
      // console.log("getElement:   ", getElement)
    }


    return(
      <ThemeProvider theme={theme}>
        <Typography onClick={props.type == 'view' ? handleView : handleDownload} variant='body1' sx={{fontWeight:600, cursor:"pointer",'&:hover':{color:"blue"}}}>{props.type == 'view' ? "View Factory PO" : "Download Factory PO"}</Typography>
        <Collapse in={false}>
        <Grid container sx={{p:2}} id="factory-purchase-order"  >

          {/* Top Row */}
          <Grid container justifyContent='space-between'   >
            <Grid item xs={6} container>
              <Grid item xs={12}>
                <img src={DolcessaLogo} />
              </Grid>
              {/* <Grid item xs={12}>
                <Typography sx={{color:"rgba(98, 98, 98, 1)"}} >{shop.address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{color:"rgba(98, 98, 98, 1)"}}>{shop.city}, {shop.province_code} {shop.zipCode}</Typography>
              </Grid>
              <Grid item xs={12} sx={{p:0}} >
                <Typography sx={{color:"rgba(98, 98, 98, 1)"}}>{shop.country}</Typography>
              </Grid> */}
              
            </Grid>
            <Grid item xs={'auto'}>
              <Grid item xs={12} container justifyContent='flex-end'>
                <Typography sx={{color:"rgba(98, 98, 98, 1)"}} >{today}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{color:"rgba(98, 98, 98, 1)"}} >Shopify Ref #{shopifyOrderNum}</Typography>
              </Grid>
            </Grid>
            <Grid container sx={{borderBottom: '2px solid', p:1}} />
          </Grid>
          <Grid item xs={12} container justifyContent='center'>
            <Typography variant='h6' >Factory PO: {factoryInfo?.factoryName} - {factoryInfo.factoryPO}</Typography>
          </Grid>

          {/* Order information */}
          <Grid container sx={{p:2}}>
              <Grid container item xs={6}>
                  <Grid item xs={12}>
                      <Typography variant='body1'>Ordered By:</Typography>
                  </Grid>
                  <Grid item xs={12}>
                      <Typography sx={{fontSize:12}}>{shop.name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                      <Typography sx={{fontSize:12}}>{shop.address1}</Typography>
                  </Grid>
                  {shop.address2 != "" ? 
                    <Grid item xs={12}>
                        <Typography sx={{fontSize:12}}>{shop.address2}</Typography>
                    </Grid> : null
                  }
                  <Grid item xs={12}>
                      <Typography sx={{fontSize:12}}>{shop.city}, {shop.state} {shop.zipCode}  {shop.country}</Typography>
                  </Grid>
                  <Grid item xs={12} container alignItems='center'>
                    <LocalPhoneIcon sx={{fontSize:12}}/> 
                    <Typography sx={{fontSize:12}}>: {shop.phone}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} container alignItems='center'>
                        <MailOutlineIcon sx={{fontSize:12}}/>
                        <Typography sx={{fontSize:12}}>: {shop.email}</Typography>
                  </Grid>
              </Grid>
              <Grid container item xs={6}>
                  <Grid item xs={12}>
                      <Typography variant='body1'>Ship To:</Typography>
                  </Grid>
                  <Grid item xs={12}>
                      <Typography sx={{fontSize:12}}>{shipTo.name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                      <Typography sx={{fontSize:12}}>{shipTo.address1}</Typography>
                  </Grid>
                  {shipTo.address2 != "" ? 
                    <Grid item xs={12}>
                        <Typography sx={{fontSize:12}}>{shipTo.address2}</Typography>
                    </Grid> : null
                  }
                  <Grid item xs={12}>
                      <Typography sx={{fontSize:12}}> {shipTo.city}, {shipTo.state} {shipTo.zipCode}  {shipTo.country}</Typography>
                  </Grid>
                  <Grid item xs={12} container alignItems='center'>
                    <LocalPhoneIcon sx={{fontSize:12}}/> 
                    <Typography sx={{fontSize:12}}>: {shipTo.phone}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} container alignItems='center'>
                        <MailOutlineIcon sx={{fontSize:12}}/>
                        <Typography sx={{fontSize:12}}>: {shipTo.email}</Typography>
                  </Grid>
              </Grid>

              <Grid container item xs={12} sx={{pt:2}} wrap={'noWrap'}>
                    <Grid container item xs={"auto"}  sx={{border:"1px solid", borderRight:"0 solid"}} wrap={'noWrap'}>
                        <Grid item xs={12} container justifyContent='center' sx={{background:"#D3D3D3", borderBottom:"1px solid"}}>
                            <Typography sx={{fontSize:16}} variant='body1'>Factory</Typography>
                        </Grid>
                        <Grid item xs={12} container justifyContent='center'>
                            <Typography sx={{fontSize:16}}>{factoryInfo?.factoryName}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={"auto"}  sx={{border:"1px solid", borderRight:"0 solid"}} wrap={'noWrap'}>
                        <Grid item xs={12} container justifyContent='center' sx={{background:"#D3D3D3", borderBottom:"1px solid"}}>
                            <Typography sx={{fontSize:16}} variant='body1'>PO Number</Typography>
                        </Grid>
                        <Grid item xs={12} container justifyContent='center'>
                            <Typography sx={{fontSize:16}}>{factoryInfo?.factoryPO}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={"auto"}  sx={{border:"1px solid", borderRight:"0 solid"}} wrap={'noWrap'}>
                        <Grid item xs={12} container justifyContent='center' sx={{background:"#D3D3D3", borderBottom:"1px solid"}}>
                            <Typography sx={{fontSize:16}} variant='body1'>Order Date</Typography>
                        </Grid>
                        <Grid item xs={12} container justifyContent='center'>
                            <Typography sx={{fontSize:16}}>{orderDate}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={"auto"} sx={{border:"1px solid"}} wrap={'noWrap'}>
                        <Grid item xs={12} container justifyContent='center' sx={{background:"#D3D3D3", borderBottom:"1px solid"}}>
                            <Typography sx={{fontSize:16}} variant='body1'>Ship Date</Typography>
                        </Grid>
                        <Grid item xs={12} container justifyContent='center'>
                            <Typography sx={{fontSize:16}} >{orderDatePlusWeek}</Typography>
                        </Grid>
                    </Grid>
              </Grid>

          </Grid>

          {/* Item Details */}
          <Grid container sx={{pt:2}}>
            <Grid item xs={'auto'} sx={{width:735}} >
              
              <DataGrid
                autoHeight
                columns={columns}
                rows={lineItems} 
                hideFooter
                
              />
            </Grid>
          </Grid>

          {/* Notes: (if any) */}
          {props.notes != "" ?
            <Grid container sx={{pt:2, pb:2}}>
              <Grid item xs={12}>
                <Typography variant='body1'>Notes:</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>{props.notes}</Typography>
              </Grid>
            </Grid> : null
          }

          {/* Bottom Text */}
          {/* <Grid container sx={{pt:2}}>
            <Typography sx={{color:"rgba(98, 98, 98, 1)"}}>If you send an email to info@mydolcessa.com</Typography>
          </Grid> */}

        </Grid>
        </Collapse>

      </ThemeProvider>

    )
    
}

export default FactoryPO