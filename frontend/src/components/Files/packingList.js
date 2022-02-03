import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useHistory} from "react-router-dom"
import { format, compareAsc } from 'date-fns'
import { jsPDF } from "jspdf";
import {htmlPDFNewTab, htmlPDFSaveFile} from "../Files/htmlPDF"

import DolcessaLogo from "./DolcessaLogo.png"



//? Material UI
import {Grid, Dialog, TextField, Select, Checkbox, FormGroup, FormControlLabel, InputAdornment, Switch, Collapse} from "@mui/material"
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
const PackingList = (props) => {
  // console.log("this is props:   ", props)
  const lineItems = props.items
    const customerAddress = {
      name: "Jerzy Horst",
      address1: "7840 Flagler St",
      address2: "",
      city: "Las Vegas",
      state: "NV",
      zipCode: "89178",
      country: "USA"
    }
    // const lineItems = [
    //   {id:1, quantity:1, sku:"19032T", name:"Helios Chevron Top", size:"Medium"},
    //   {id:2, quantity:1, sku:"19032B", name:"Helios Chevron Bottom", size:"Large"},
    // ]
    const shopifyOrderNum = props.orderNumber
    const note = "The other items will be shipped soon!"
    const shop = {
        address:"6551 S Las Vegas Blvd Suite 147",
        city: "Las Vegas",
        province_code:"NV",
        zip:"89119",
        country:"USA",
        email:"info@mydolcessa.com"
    }
 
    const today = format(new Date(), 'MM/dd/yyyy')

    const [open, setOpen] = useState(false)

    const renderCellFormat = (input) => {
      return(
        <Typography variant='body1'>{input}</Typography>
      )
    }

    const columns = [
      {field:'quantity', width:100, renderHeader:()=>{return(<Typography variant='h7'>Quantity</Typography>)}, renderCell: (e)=>renderCellFormat(`${e.row.quantity}x`) },
      {field:'sku', width:125, renderHeader:()=>{return(<Typography variant='h7'>SKU</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.sku) },
      {field:'style', flex:1, renderHeader:()=>{return(<Typography variant='h7'>Style</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.name) },
      {field:'size', width:125, renderHeader:()=>{return(<Typography variant='h7'>Size</Typography>)}, renderCell: (e)=>renderCellFormat(e.row.size) },
    ]
    
    const handleView = async() => {
      const getElement = await document.getElementById("packing-list")
      htmlPDFNewTab(getElement, `Shopify #${shopifyOrderNum} - Packing List`)
      // console.log("getElement:   ", getElement)
    }
    const handleDownload = async() => {
      const getElement = await document.getElementById("packing-list")
      htmlPDFSaveFile(getElement, `Shopify #${shopifyOrderNum} - Packing List`)
      // console.log("getElement:   ", getElement)
    }

    return(
      <ThemeProvider theme={theme}>
        <Typography onClick={props.type == 'view' ? handleView : handleDownload} variant='body1' sx={{fontWeight:600, cursor:"pointer",'&:hover':{color:"blue"}}}>{props.type == 'view' ? "View Packing List" : "Download Packing List"}</Typography>
        <Collapse in={false}>
        <Grid container sx={{p:2}} id="packing-list"  >

          {/* Top Row */}
          <Grid container justifyContent='space-between'   >
            <Grid item xs={6} container>
              <Grid item xs={12}>
                <img src={DolcessaLogo} />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{color:"rgba(98, 98, 98, 1)"}} >{shop.address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{color:"rgba(98, 98, 98, 1)"}}>{shop.city}, {shop.province_code} {shop.zipCode}</Typography>
              </Grid>
              <Grid item xs={12} sx={{p:0}} >
                <Typography sx={{color:"rgba(98, 98, 98, 1)"}}>{shop.country}</Typography>
              </Grid>
              
            </Grid>
            <Grid item xs={'auto'}>
              <Grid item xs={12} container justifyContent='flex-end'>
                <Typography sx={{color:"rgba(98, 98, 98, 1)"}} >{today}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{color:"rgba(98, 98, 98, 1)"}} >Invoice for #{shopifyOrderNum}</Typography>
              </Grid>
            </Grid>
            <Grid container sx={{borderBottom: '2px solid', p:1}} />
          </Grid>

          {/* Item Details */}
          <Grid container sx={{pt:2}}>
            <Grid item xs={'auto'} sx={{width:735}} >
              <Grid item xs={12} container justifyContent='center'>
                <Typography variant='h6' >Packing List</Typography>
              </Grid>
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
          <Grid container sx={{pt:2}}>
            <Typography sx={{color:"rgba(98, 98, 98, 1)"}}>If you have any questions, please send an email to info@mydolcessa.com</Typography>
          </Grid>

        </Grid>
        </Collapse>

      </ThemeProvider>

    )
    
}

export default PackingList