import { Route } from "react-router-dom";
import LandingPage from "./components/Landingpage";
import UserHomePage from "./components/userHomePage";
import ProductDetail from "./components/EventDetailsPage";
import MyNavbar from "./components/UI/Navbar";
import { Switch } from "react-router";
import PollsPage from "./components/PollsPage";
import { useState , useEffect} from "react";
function App() {
  
  return (
    <div>
      <MyNavbar />
      <Switch>
        {" "}
        <Route path="/" exact>
          <LandingPage />
        </Route>
        <Route path="/events" exact>
          <UserHomePage />
        </Route>
        <Route path="/event_detail/:eventID">
          <ProductDetail />
        </Route>
        <Route path="/polls">
          <PollsPage/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
