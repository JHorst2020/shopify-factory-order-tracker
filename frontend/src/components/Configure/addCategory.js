import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//?Material-UI
import {Grid, Dialog, TextField, Select, Checkbox, FormGroup, FormControlLabel, InputAdornment, Switch, Stack, FormControl} from "@mui/material"
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
import { createTheme, ThemeProvider } from '@mui/material/styles'

//? Material UI Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from '@mui/icons-material/Delete';

//? Redux Store
import {getCategories, addCategories} from "../../store/items"

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
          color: "white"
          // color: "red"
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



const AddCategory = () => {
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const [allCategories, setAllCategories] = useState([])
  const [categoryName, setCategoryName] = useState("")

  const initialLoad = async() => {
    const categories = await dispatch(getCategories())
    // console.log("categories", categories.currentCategories)
    setAllCategories(categories.currentCategories)
  }

  const handleClose = () => {
    setCategoryName("")
    setOpen(false)
  }

  const handleSubmit = async() => {
    await dispatch(addCategories({name:categoryName}))
    setCategoryName("")
    const categories = await dispatch(getCategories())
    setAllCategories(categories.currentCategories)
  }


  useEffect(()=>{
    initialLoad()
  },[])


  return (
    <Grid container>
      <Grid item xs={12}>
        <Button fullWidth style={{background:"#FCA311"}} color="primary" variant="contained" endIcon={<AddCircleOutlineIcon />} onClick={()=>setOpen(!open)}>Add Category</Button>
      </Grid>

      <Dialog open={open} fullWidth maxWidth='sm' onClose={()=>setOpen(!open)}>
        <Grid container sx={{backgroundColor:"#14213D", padding:2}}>
          <Grid item xs={12}>
            <Typography variant='h4' sx={{color:"#FCA311"}}>Add New Category</Typography>
          </Grid>
        </Grid>
        <Grid container sx={{p:2}}>
          <ThemeProvider theme={theme}>
            <Grid item xs={12}>
              <Typography variant='body1'>New Category Name</Typography>
            </Grid>
            <TextField fullWidth value={categoryName} onChange={(e)=>setCategoryName(e.target.value)} />
          </ThemeProvider>
        </Grid>
        <Grid container sx={{p:2}} >
          <ThemeProvider theme={theme}>
            <Grid item xs={12}>
              <Typography variant='body1'>Current Categories</Typography>
            </Grid>
            {allCategories.map((ele)=>{
              return(
                <Grid item xs={12}>
                  <Typography variant='h6'>{ele.name}</Typography>
                </Grid>
              )
            })}
          </ThemeProvider>
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

export default AddCategory