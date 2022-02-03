import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddVendor from "./addVendor"
import VendorPricingModal from "../Modals/vendorPricing"
import AddCategory from "../Configure/addCategory"

//? Material UI
import CategoryIcon from '@mui/icons-material/Category';
import { Grid, Icon, Dialog } from "@mui/material";
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
import {getVendors, getVendorPricing, getBGNExchangeRate} from "../../store/vendors"
import {getCategories} from "../../store/items"


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

const Vendors = () => {

  const dispatch = useDispatch()
  const [openCategory, setOpenCategory] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState({})
  const [liveExchangeRate, setLiveExchangeRate] = useState({})

  const initialLoad = async()=> {
    dispatch(getVendors())
    dispatch(getVendorPricing())
    dispatch(getCategories())
    if(liveExchangeRate.BGN == null){
      const liveRate = await dispatch(getBGNExchangeRate())
      setLiveExchangeRate(liveRate)
    }
  }
  const allVendors = useSelector(state=> state.vendor.Vendors)
  const vendorPricing = useSelector(state=> state.vendor.pricing)

  useEffect(()=>{
    initialLoad()
  },[])


  const renderCellFormat = (input) => {
    return(
      <Typography variant='body1'>{input}</Typography>
    )
  }

  const renderCategoryModal = (input) => {
    return(
      <Button onClick={()=>{setOpenCategory(!openCategory); setSelectedVendor(input)}} variant='body1'>Edit</Button>
    )
  }

  const columns = [
    {field: "companyName", flex:1, renderHeader:()=>{return(<Typography variant='h7'>Company Name</Typography>)}, renderCell:(e)=>renderCellFormat(e.row.name)  },
    {field: "currency", flex:1, renderHeader:()=>{return(<Typography variant='h7'>Currency</Typography>)}, renderCell:(e)=>renderCellFormat(e.row.currency)  },
    {field: "FactoryRep", flex:1, renderHeader:()=>{return(<Typography variant='h7'>Vendor Rep</Typography>)}, renderCell:(e)=>renderCellFormat(`${e.row.ContactInfo.firstName} ${e.row.ContactInfo.lastName}`)  },
    {field: "country", flex:1, renderHeader:()=>{return(<Typography variant='h7'>Location</Typography>)}, renderCell:(e)=>renderCellFormat(`${e.row.ContactInfo.city}, ${e.row.ContactInfo.state} - ${e.row.ContactInfo.country}`)  },
    {field: "category", flex:1, renderHeader:()=>{return(<Typography variant='h7'>Category</Typography>)}, renderCell:(e)=>renderCategoryModal(e.row)  },
   
  ]

  return (
    <Grid container>
      <Grid item xs={12} sx={{height:"75vh", width:"100%", padding:3}}>
        <Grid container alignItems="center" justifyContent="space-between" sx={{padding:3, backgroundColor:"#E5E5E5"}}>
          <Grid item>
            <Typography variant="h3" sx={{color:"#14213D"}}>Vendors</Typography>
          </Grid>
          <Grid item >
            <Grid item sx={{pb:1}}>
              <AddVendor initialLoad={initialLoad}  />
            </Grid>
            <Grid item >
              <AddCategory />
            </Grid>
          </Grid>
        </Grid>
        <ThemeProvider theme={theme}>
          <DataGrid rowHeight={38} columns={columns} rows={allVendors} />
        </ThemeProvider>
      </Grid>
      <Dialog open={openCategory} onClose={()=>setOpenCategory(false)} fullWidth maxWidth="sm">
        <VendorPricingModal  vendor={selectedVendor} closeModal={setOpenCategory} liveExchangeRate={liveExchangeRate} reloadVendors={initialLoad} />
      </Dialog>
    </Grid>
  );
};

export default Vendors;
