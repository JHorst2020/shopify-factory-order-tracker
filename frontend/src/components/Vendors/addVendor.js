import React, { useState } from "react";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//?Material-UI
import {Grid, Dialog, TextField, Select, Checkbox, FormGroup, FormControlLabel, InputAdornment} from "@mui/material"
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

//? Material UI Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

//? Redux Store
import {addNewVendor} from "../../store/vendors"

const CreateVendor = (props) => {
  const initialLoad = props.initialLoad

  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [addressLine3, setAddressLine3] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("")
  const [currency, setCurrency] = useState("")

  const handleClose = () => {
    setOpen(false)
    setCompanyName("")
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhone("")
    setAddressLine1("")
    setAddressLine2("")
    setAddressLine3("")
    setCity("")
    setState("")
    setZipCode("")
    setCountry("")
    setCurrency("")
  }

  const handleSubmit = async() => {
    const payload = {
      companyName: companyName,
      firstName: firstName,
      lastName: lastName,
      email,
      phone,
      address1: addressLine1,
      address2: addressLine2,
      address3: addressLine3,
      city: city,
      state: state,
      zipcode: zipCode,
      country: country,
      active:true,
      localCurrency: currency,
    }
    await dispatch(addNewVendor(payload))
    initialLoad()
    handleClose()
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Button fullWidth style={{background:"#FCA311"}} color="primary" variant="contained" endIcon={<AddCircleOutlineIcon />} onClick={()=>setOpen(!open)}>Add Vendor</Button>
      </Grid>
      <Dialog open={open} fullWidth maxWidth='sm'>
        <Grid container sx={{backgroundColor:"#14213D", padding:2}}>
          <Grid item xs={12}>
            <Typography variant='h4' sx={{color:"#FCA311"}}>Add New Vendor</Typography>
          </Grid>
        </Grid>
        <Grid container sx={{padding:2}} spacing={3}>
          <Grid item xs={8}>
            <Typography>Company Name</Typography>
            <TextField fullWidth variant="outlined" value={companyName} onChange={(e)=>setCompanyName(e.target.value)} />
          </Grid>
          <Grid item xs={4}>
            <Typography>Currency</Typography>
              <Select fullWidth variant='outlined' value={currency} onChange={(e)=>setCurrency(e.target.value)} menuProps={{getContentAnchorEl: () => null}}>
                  <MenuItem value="USD">USD - $</MenuItem>
                  <MenuItem value="BGN">BGN - Лв.</MenuItem>
                  <MenuItem value="CNY">CNY - ¥</MenuItem>
              </Select>
            </Grid>
          <Grid item xs={6}>
            <Typography>Rep First Name</Typography>
            <TextField fullWidth variant="outlined" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <Typography>Rep Last Name</Typography>
            <TextField fullWidth variant="outlined" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <Typography>Email</Typography>
            <TextField fullWidth variant="outlined" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <Typography>Phone Number</Typography>
            <TextField fullWidth variant="outlined" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <Typography>Address Line 1</Typography>
            <TextField fullWidth variant="outlined" value={addressLine1} onChange={(e)=>setAddressLine1(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <Typography>Address Line 2</Typography>
            <TextField fullWidth variant="outlined" value={addressLine2} onChange={(e)=>setAddressLine2(e.target.value)} />
          </Grid>
          <Grid item xs={4}>
            <Typography>City</Typography>
            <TextField fullWidth variant="outlined" value={city} onChange={(e)=>setCity(e.target.value)} />
          </Grid>
          <Grid item xs={2}>
            <Typography>State</Typography>
            <TextField fullWidth variant="outlined" value={state} onChange={(e)=>setState(e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <Typography>Zip Code</Typography>
            <TextField fullWidth variant="outlined" value={zipCode} onChange={(e)=>setZipCode(e.target.value)} />
          </Grid>
          <Grid item xs={3}>
            <Typography>Country</Typography>
            <TextField fullWidth variant="outlined" value={country} onChange={(e)=>setCountry(e.target.value)} />
          </Grid>
        </Grid>
        <Grid container justifyContent="space-around" sx={{padding:3}}>
                    <Grid item xs={3}>
                        <Button onClick={handleClose} sx={{color:"#FCA311", '&:hover':{backgroundColor:"#FCA31110"}}}fullWidth>Cancel</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button sx={{backgroundColor:"#FCA311", '&:hover':{backgroundColor:"#FCA31180"}}} color="primary" variant="contained" fullWidth onClick={handleSubmit}>Submit</Button>
                    </Grid>
                </Grid>
      </Dialog>
    </Grid>
  );
};

export default CreateVendor;
