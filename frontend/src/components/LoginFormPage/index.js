import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import './LoginForm.css';
import Typical from "react-typical"
import Typewriter from 'typewriter-effect'

//? MATERIAL-UI COMPONENTS
import {Grid, Paper, Box, Typography, TextField, InputLabel, Button} from '@mui/material'
import { makeStyles, withStyles, styled } from "@mui/styles";
import { createTheme, ThemeProvider } from '@mui/material/styles'

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
          contrastText:'white'
      },
  },
  typography: {
      h1: {
          fontWeight: "bold",
          // color: "#14213D"
          color: "#FCA311"
          // color: "red"
      },
      h4: {
          // color: "#14213D"
          color: "#FCA311"
          // color: "red"
      },
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
          color: "red",
          // fontWeight: 600,
      },
  },

})


function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .catch((res) => {
        if (res.data && res.data.errors) setErrors(res.data.errors);
      });
  };

  return (
    <Grid container sx={{backgroundColor:"#13213D", minHeight:'100vh'}} justifyContent='center' alignItems='center'>
        <Grid item xs={12} sm={6} container sx={{padding:2}} >
          <Grid item xs={"auto"}>
              <ThemeProvider theme={theme}>
                <Grid item xs={12}>
                  <Typography noWrap variant="h1" >Dolcessa </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h4" ><Typewriter options = {{strings:["Create Purchase Orders.....", "Track Factory Status.....",  "Import Shopify Orders...."], autoStart: true, loop:true, deleteSpeed:10, delay:20}}/></Typography>
                </Grid>
              </ThemeProvider>
          </Grid>
        </Grid>
        <Grid item container xs={12} sm={4} sx={{p:2}}>
            <Paper  elevation={3} sx={{p:2}}>
              <Box sx={{width:"100%"}}>
                <Grid container spacing={3}>
                  <Grid container item xs={12} justifyContent='center'>
                    <ThemeProvider theme={theme}>
                      <Typography variant="body1">{errors}</Typography>
                    </ThemeProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel>Username</InputLabel>
                    <TextField fullWidth value={credential} onChange={(e)=>setCredential(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel>Password</InputLabel>
                    <TextField type="password" fullWidth value={password} onChange={(e)=>setPassword(e.target.value)} />
                  </Grid>
                  <Grid container item justifyContent='center'>
                    <Grid item xs={3}>
                      <ThemeProvider theme={theme}>
                        <Button color='button2' fullWidth variant='contained'  onClick={handleSubmit}>Submit</Button>
                      </ThemeProvider>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
        </Grid>
    </Grid>
  );
}

export default LoginFormPage;
