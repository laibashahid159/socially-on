import classes from "./LoginModal.module.css";
import Card from "./Card";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import validator from "validator";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Alert, Spinner } from "reactstrap";
import ReactCodeInput from "react-code-input";


const SignupModal = (props) => {
  const history = useHistory();
  //states used in the signup form
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setenteredPassword] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [enteredName, setEnteredName] = useState("");
  const [nameError, setNameError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [visible, setVisible] = useState(true);
  const onDismiss = () => setVisible(false);
  const [visible1, setVisible1] = useState(true);
  const onDismiss1 = () => setVisible1(false);
  const [showSuccessModal, setShowSuccessModal]= useState(false)

//alert timeout function
  const setAlertTimeout = (func) => {
    setTimeout(() => {
      func("");
    }, 3000);
  };

  //Input handler
  const signupHandler = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");
    setIsLoading(true);
    if (
      validator.isEmail(enteredEmail) &&
      enteredEmail.includes("turnlunchon") &&
      !(enteredName.trim().length < 2) &&
      !(enteredPassword.length < 6)
    ) {
      setEmailError("");
      try {
        const response = await fetch(
          "https://socially-api.ongo.io/api/v1/users",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: enteredName,
              email: enteredEmail,
              password: enteredPassword,
              admin: false,
            }),
          }
        );
        const { body, message, statusCode } = await response.json();

        if (statusCode != 200) {
          throw new Error(message);
        }
        setSuccess(message);
        setAlertTimeout(setSuccess);
        setShowVerificationModal(true);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setAlertTimeout(setError);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      if (
        !enteredEmail.includes("turnlunchon") &&
        validator.isEmail(enteredEmail)
      ) {
        setEmailError("Your munch on email is required.");
      }
      if (!validator.isEmail(enteredEmail)) {
        setEmailError(" Enter a valid Email.");
      }

      if (enteredPassword.length < 6) {
        setpasswordError(
          "This value is too short. It should have 6 characters or more."
        );
      }
      if (enteredPassword.trim() == "") {
        setpasswordError(" Password is Required.");
      }

      if (enteredName.trim().length < 2) {
        setNameError(
          " This value is too short. It should have 2 characters or more."
        );
      }
      if (enteredName.trim() == "") {
        setNameError(" Name is Required.");
      }
    }

    event.preventDefault();
  };

  //this hides sign-up modal
  const cancelHandler = () => {
    setSuccess("");
    props.onCancel();
  };

  //handles code verification
  const verifHandler = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    try {
      const response = await fetch(
        "https://socially-api.ongo.io/api/v1/users/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: enteredEmail,
            code: enteredCode,
          }),
        }
      );
      const { body, message, statusCode } = await response.json();
      if (statusCode != 200) {
        throw new Error(message);
      }
      setSuccess(message);
      console.log("body", body);
      localStorage.setItem("user", body.name);
      localStorage.setItem("userid", body.id);
      localStorage.setItem("email", body.email);
      localStorage.setItem("admin", body.admin);
      // history.push(`/events`);
      setShowSuccessModal(true)
      setSuccess("");

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setAlertTimeout(setError);
      setIsLoading(false);
    }
  };

  //Handles input changes
  const emailInputChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
    setEmailError("");
  };

  const passwordInputChangeHandler = (event) => {
    setenteredPassword(event.target.value);
    setpasswordError("");
  };

  const nameInputHandler = (event) => {
    setEnteredName(event.target.value);
    setNameError("");
  };

  //password visiblity
  const visibilityHandler = () => {
    setIsVisible(!isVisible);
  };

  //verification code Handler
  const codeHandler = (value) => {
    setEnteredCode(value);
  };

  return (
    <div>
      <div className={classes.backdrop} />
      <div className={classes.modal1}>
        {" "}
        {!error.trim() == 0 && <Alert color="danger" isOpen={visible} toggle={onDismiss}>{error}</Alert> } 
        {!success.trim() == 0 && <Alert color="success" isOpen={visible1} toggle={onDismiss1}>{success}</Alert>}
      </div>
    
      {!showVerificationModal ? (
        <Card className={classes.modal}>
          <header className={classes.header}>
            <h2 style={{ fontWeight: "700" }}>Sign Up</h2>
            <Button
              onClick={cancelHandler}
              style={{ borderRadius: "40px", padding: "2px 10px 3px" }}
            >
              {" "}
              x
            </Button>
          </header>
          <div className={classes.content}>
            <Form>
              <FormGroup style={{marginBottom:'0px'}}>
                <Label for="FirstName" style={{ fontWeight: "600" }}>
                  Name
                </Label>
                <Input
                  type="text"
                  name="FirstName"
                  id="FirstName"
                  placeholder="Enter your name "
                  onChange={nameInputHandler}
                />
              </FormGroup>
              <p
                style={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "#e75653",
                  marginTop: "5px",
                  paddingLeft:'5px'
                }}
              >
              {nameError}
              </p>
              <FormGroup style={{marginBottom:'0px'}}>
                <Label for="Email" style={{ fontWeight: "600" }}>
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="abc@turnlunchon.com"
                  onChange={emailInputChangeHandler}
                />
              </FormGroup>
              <p
                style={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "#e75653",
                  marginTop: "5px",
                  paddingLeft:'5px'
                }}
              >
                {emailError}
              </p>
              <FormGroup style={{marginBottom:'0px'}}>
                <Label for="Password" style={{ fontWeight: "600" }}>
                  Password
                </Label>
                {isVisible ? (
                  <img
                    src="images/eyecross.svg"
                    alt="eyeicon"
                    onClick={visibilityHandler}
                    className={classes.eye}
                  />
                ) : (
                  <img
                    src="images/eye.svg"
                    alt="eyeicon"
                    onClick={visibilityHandler}
                    className={classes.eye}
                  />
                )}

                <Input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  id="Password"
                  placeholder="Password"
                  onChange={passwordInputChangeHandler}
                />
              </FormGroup >
              <p
                style={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "#e75653",
                  marginTop: "5px",
                  paddingLeft:'5px'
                }}
              >
                {passwordError}
              </p>
              <footer className={classes.actions}>
                {!isLoading ? (
                  <Button type="submit" onClick={signupHandler}>
                    SIGN UP
                  </Button>
                ) : (
                  <Spinner
                    color="secondary"
                    children={null}
                    style={{
                      width: "25px",
                      height: "25px",
                      marginTop: "5px",
                      marginRight: "20px",
                    }}
                  />
                )}
              </footer>
            </Form>
          </div>
        </Card>
      ) : (<>
      {!showSuccessModal &&  <Card className={classes.modal}>
          <header className={classes.header}>
            <h2 style={{ fontWeight: "700" }}>Verify</h2>
            <Button
              style={{ borderRadius: "40px", padding: "2px 10px 3px" }}
              onClick={cancelHandler}
            >
              x
            </Button>
          </header>
          <div className={classes.content}>
            <h6>
              An Email with verfication code has been sent
              to the email address. Please enter the code here
            </h6>
            <div className={classes.code}>
              <ReactCodeInput type="text" fields={6} onChange={codeHandler} />
            </div>
            <footer className={classes.actions}>
              {!isLoading ? (
                  <Button type="submit" onClick={verifHandler}>
                    Verify
                  </Button>
                ) : (
                  <Spinner
                    color="secondary"
                    children={null}
                    style={{
                      width: "25px",
                      height: "25px",
                      marginTop: "5px",
                      marginRight: "20px",
                    }}
                  />
                )}
            </footer>
          </div>
        </Card>}
        {showSuccessModal &&  <Card className={classes.modal}>
          <header className={classes.header}>
            <h2 style={{ fontWeight: "700" }}>Verify</h2>
            <Button
              style={{ borderRadius: "40px", padding: "2px 10px 3px" }}
              onClick={cancelHandler}
            >
              x
            </Button>
          </header>
          <div className={classes.content}>
            <h6>
            Your Socially:ON account has been created. click OK to login.
            </h6>
            <footer className={classes.actions}>
                  <Button type="submit" onClick={()=>{history.push(`/events`);     props.onSet();}}>
                    OK
                  </Button> 
            </footer>
          </div>
        </Card>}
      
        </>
      )}
    </div>
  );
};

export default SignupModal;
