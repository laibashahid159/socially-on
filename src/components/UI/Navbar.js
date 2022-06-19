import React, { Fragment, useEffect, useState } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import classes from "../Landingpage.module.css";
import { Container } from "reactstrap";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import LogoutModal from "./LogoutModal";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import { NavLink, useHistory } from "react-router-dom";

//Navbar function begins here
const MyNavbar = (props) => {
  const [showLoginModal, setshowLoginModal] = useState(false);
  const [showSignupModal, setshowSignupModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loggedin, setLoggedIn] = useState(true);
  const toggle = () => {
    window.innerWidth < 576 && setIsOpen(!isOpen);
  };
  const history = useHistory();

  //necessary Handlers
  const signupHandler = (event) => {
    toggle();
    event.preventDefault();
    setshowSignupModal(true);
    setshowLoginModal(false);
  };

  const loginHandler = (event) => {
    toggle();
    setshowLoginModal(true);
    setshowSignupModal(false);
    event.preventDefault();
  };

  const setLoggedInHandler = () => {
    setLoggedIn(true);
    setshowLoginModal(false);
    setshowSignupModal(false);
  };

  const setLoggedoutHandler = () => {
    setLoggedIn(false);
    setShowLogoutModal(false);
  };

  const cancelHandler = () => {
    setshowLoginModal(false);
  };

  const logoutHandler = (event) => {
    toggle();
    setShowLogoutModal(true);
  };

  const signupCancelHandler = () => {
    setshowSignupModal(false);
  };

  const logoutCancelHandler = () => {
    setShowLogoutModal(false);
  };

  //maintaining user session here
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");
  useEffect(() => {
    if (user === null) {
      setLoggedIn(false);
    }
  }, []);

  return (
    <div>
      {showLoginModal && (
        <LoginModal onSet={setLoggedInHandler} onCancel={cancelHandler} />
      )}
      {showSignupModal && (
        <SignupModal
          onSet={setLoggedInHandler}
          onCancel={signupCancelHandler}
        />
      )}
      {showLogoutModal && (
        <LogoutModal
          onSet={setLoggedoutHandler}
          onCancel={logoutCancelHandler}
        />
      )}
      <Navbar
        light
        expand="sm"
        style={{
          backgroundColor: "#e75653",
          display: "flex",

          justifyContent: "space-between",
          zIndex: 200,
          position: "fixed",
          width: "100%",
        }}
      >
        {" "}
        <Container>
          <NavbarBrand
            className={classes.onLogo + " d-flex"}
            style={{ margin: "0px", padding: "0px", fontSize: "18px" }}
          >
            <NavbarToggler
              onClick={toggle}
              className="mr-2"
              style={{ color: "black", backgroundColor: "white" }}
            />
            <div>
              <img
                src="/images/logo.svg"
                alt="logo"
                className={classes.img}
                onClick={() => {
                  history.push(`/`);
                }}
              />
            </div>
          </NavbarBrand>

          <Collapse isOpen={isOpen} navbar>
            <Nav
              className="mr-auto w-100"
              style={{
                justifyContent: "flex-end",
              }}
              navbar
            >
              {!loggedin && (
                <Fragment>
                  <NavItem className={classes.NavItem}>
                    <button onClick={signupHandler} className={classes.button1}>
                      {" "}
                      Sign Up
                    </button>
                  </NavItem>
                  <NavItem className={classes.NavItem}>
                    <button onClick={loginHandler} className={classes.button1}>
                      {" "}
                      Login{" "}
                    </button>
                  </NavItem>
                </Fragment>
              )}

              <div className={classes.navlinks}>
                {" "}
                {console.log("admin value", admin)}
                {admin === "true" && loggedin && (
                  <NavItem>
                    <a className={classes.button1}
                      href={process.env.REACT_APP_ADMIN_SIDE}
                      target="_blank"
                      onClick={toggle}
                    >
                      Admin
                    </a>
                  </NavItem>
                )}
                {loggedin && (
                  <NavItem className={classes.NavItem}>
                    <NavLink
                    className={classes.button1}
                      activeClassName={classes.active}
                      to="/events"
                      onClick={toggle}
                    >
                      {" "}
                      Events{" "}
                    </NavLink>
                  </NavItem>
                )}
                {loggedin && (
                  <NavItem className={classes.NavItem}>
                    <NavLink
                    className={classes.button1}
                      activeClassName={classes.active}
                      to="/polls"
                      onClick={toggle}
                    >
                      {" "}
                      Polls{" "}
                    </NavLink>
                  </NavItem>
                )}
              </div>

              {loggedin && (
                <NavItem className={classes.NavItem}>
                  <button onClick={logoutHandler} className={classes.button3}>
                    {" "}
                    Logout
                  </button>
                </NavItem>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default MyNavbar;
