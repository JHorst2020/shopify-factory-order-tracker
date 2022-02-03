import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
// import CreateParentClient from "./components/Customers/addCustomer"
import Configure from "./components/Configure"
// import CreateVendor from "./components/Vendors/addVendor"
import Vendors from "./components/Vendors"
import Items from "./components/Items"
import CustomerOrder from "./components/CustomerOrders"
import Customers from "./components/Customers"
import FactoryOrder from "./components/FactoryOrder"
import AdminSignup from "./components/AdminSignup"
import CustomerList from "./components/CustomerList"
import Home from "./components/Home"
import PackingList from "./components/Files/packingList"
import FactoryPO from "./components/Files/factoryPO"

function App() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(state => state.session.user)
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route exact path="/" >
            {loggedInUser ? <CustomerOrder /> : <LoginFormPage />}
            {/* {loggedInUser ? <Home /> : <LoginFormPage />} */}
          </Route>
          {/* <Route path="/signup">
            <SignupFormPage />
          </Route> */}
          <Route path="/adminSignupPage">
            <AdminSignup />
          </Route>
          <Route exact path="/factory-orders">
            <FactoryOrder />
          </Route>
          <Route exact path="/customer-orders">
            <CustomerOrder />
          </Route>
          <Route path="/configure">
            <Configure />
          </Route>
          <Route path="/vendors">
            <Vendors />
          </Route>
          <Route path="/customers">
            <Customers />
          </Route>
          <Route path="/items">
            <Items />
          </Route>
          
          <Route path="/addCustomer">
            {/* <CreateParentClient /> */}
          </Route>
          <Route path="/addVendor">
            {/* <CreateVendor /> */}
          </Route>
          <Route path="/addCustomerOrder">
            <CustomerOrder />
          </Route>
          <Route path="/addFactoryOrder">
            <FactoryOrder />
          </Route>
          <Route path="/shopify-customer-list">
            <CustomerList />
          </Route>
          <Route path="/" >
            {loggedInUser ? <CustomerOrder /> : <LoginFormPage />}
            {/* {loggedInUser ? <Home /> : <LoginFormPage />} */}
          </Route>
        </Switch>
      )}

    </>
  );
}

export default App;
