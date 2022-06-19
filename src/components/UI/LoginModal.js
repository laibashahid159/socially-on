import classes from "./LoginModal.module.css";
import Card from "./Card";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import validator from "validator";
import { useState } from "react";
import ReactCodeInput from "react-code-input";

//login modal starts here
const LoginModal = (props) => {
  const history = useHistory();
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setenteredPassword] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showForgotPaswwordModal, setShowForgotPaswwordModal] = useState(false);
  const [showCode, setshowcode] = useState(false);
  const [code, setCode] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [disableReset, setDisableReset] = useState(false);
  const [success, setSuccess] = useState("");
  const [visible, setVisible] = useState(true);
  const onDismiss = () => setVisible(false);
  const [visible1, setVisible1] = useState(true);
  const onDismiss1 = () => setVisible1(false);

  const setAlertTimeout = (func) => {
    setTimeout(() => {
      func("");
    }, 3000);
  };

  //login Handler for loggin in
  const loginHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (
      validator.isEmail(enteredEmail) &&
      enteredEmail.includes("turnlunchon") &&
      !(enteredPassword.length < 6)
    ) {
      setEmailError("");

      try {
        const response = await fetch(
          "https://socially-api.ongo.io/api/v1/users/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: enteredEmail,
              password: enteredPassword,
            }),
          }
        );
        const { body, message, statusCode } = await response.json();

        if (statusCode != 200) {
          throw new Error(message);
        }

        localStorage.setItem("user", body.name);
        localStorage.setItem("userid", body.id);
        localStorage.setItem("email", body.email);
        localStorage.setItem("admin", body.admin);

        history.push(`/events`);
        setIsLoading(false);
        props.onSet();
      } catch (error) {
        setError(error.message);
        setAlertTimeout(setError);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      if (!validator.isEmail(enteredEmail)) {
        setEmailError(" Enter a valid Email.");
      }
      if (
        !enteredEmail.includes("turnlunchon") &&
        validator.isEmail(enteredEmail)
      ) {
        setEmailError(" Your munch on email is required.");
      }

      if (enteredPassword.length < 6) {
        setpasswordError(
          "This value is too short. It should have 6 characters or more."
        );
      }
      if (enteredPassword.trim() == "") {
        setpasswordError(" Password is required.");
      }
    }
  };

  //Cancel Handler for closing login modal
  const cancelHandler = () => {
    setShowForgotPaswwordModal(false);
    props.onCancel();
  };

  // Sends Email for resetting pssword
  const EmailForgetPassHandler = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://socially-api.ongo.io/api/v1/users/forgotpassword/${resetEmail}`
      );
      const data = await response.json();
      if (data.statusCode != 200) {
        throw new Error(data.message);
      }

      setIsLoading(false);
      setshowcode(true);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setAlertTimeout(setError);
    }
  };

  //Manages input change
  const emailInputChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
    setEmailError("");
  };

  const passwordInputChangeHandler = (event) => {
    setenteredPassword(event.target.value);
    setpasswordError("");
  };

  //for password visibility
  const visibilityHandler = () => {
    setIsVisible(!isVisible);
  };

  //show foget password modal
  const forgotPasswordModalHandler = () => {
    setShowForgotPaswwordModal(true);
  };

  //sends verification code
  const verificationHandler = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(
        "https://socially-api.ongo.io/api/v1/users/codeverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: resetEmail,
            code: code,
          }),
        }
      );
      const data = await response.json();
      if (data.statusCode != 200) {
        throw new Error(data.message);
      }
      setIsLoading(false);
      console.log(data);
      setShowPasswordReset(true);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setAlertTimeout(setError);
    }
  };

  //sends new password
  const PasswordResetHandler = async (event) => {
    console.log("i am called");
    setIsLoading(true);
    event.preventDefault();
    if (!(resetPassword.length < 6)) {
      console.log("if ran");
      try {
        const response = await fetch(
          "https://socially-api.ongo.io/api/v1/users/passwordreset",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: resetEmail,
              password: resetPassword,
              code: code,
            }),
          }
        );
        const data = await response.json();

        if (data.statusCode != 200) {
          throw new Error(data.message);
        }

        setIsLoading(false);
        console.log(data);
        setDisableReset(true);
        setError("");
        setSuccess("Password reset successful.");
        setAlertTimeout(setSuccess);
        setShowForgotPaswwordModal(false);
      } catch (error) {
        setIsLoading(false);
        setError(error.message);
        setAlertTimeout(setError);
      }
    } else {
      setIsLoading(false);
      if (resetPassword.length < 6) {
        setpasswordError(
          "This value is too short. It should have 6 characters or more."
        );
      }
      if (resetPassword.trim() == "") {
        setpasswordError(" Password is Required.");
      }
    }
  };

  return (
    <div>
      <div className={classes.backdrop} />
      <div className={classes.modal1}>
        {!error.trim() == 0 && (
          <Alert color="danger" isOpen={visible} toggle={onDismiss}>
            {error}
          </Alert>
        )}
        {disableReset && !success.trim() == 0 && (
          <Alert color="success" isOpen={visible1} toggle={onDismiss1}>
            {success}
          </Alert>
        )}
      </div>
      {!showForgotPaswwordModal && (
        <Card className={classes.modal}>
          <header className={classes.header}>
            <h2 style={{ fontWeight: "700" }}>Login</h2>
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
                <Label for="exampleEmail" style={{ fontWeight: "600" }}>
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
                  paddingLeft: "5px",
                }}
              >
                {emailError}
              </p>
              <FormGroup style={{marginBottom:'0px'}}>
                <Label for="examplePassword" style={{ fontWeight: "600" }}>
                  Password{" "}
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
                  id="examplePassword"
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
                  paddingLeft: "5px",
                }}
              >
                {passwordError}
              </p>
              <div style={{ textDecoration: "underline", cursor: "pointer" }}>
                <h6
                  style={{ display: "inline" }}
                  onClick={forgotPasswordModalHandler}
                >
                  forgot password?
                </h6>
              </div>
              <footer className={classes.actions}>
                {!isLoading ? (
                  <Button type="submit" onClick={loginHandler}>
                    LOGIN
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
      )}
      {showForgotPaswwordModal && !showPasswordReset && (
        <Card className={classes.modal}>
          <header className={classes.header}>
            <h2 style={{ fontWeight: "700" }}>Reset</h2>
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
                <Label for="exampleEmail" style={{ fontWeight: "600" }}>
                  Enter email for password reset:
                </Label>
                <Input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="abc@turnlunchon.com"
                  onChange={(event) => {
                    setResetEmail(event.target.value);
                  }}
                  disabled={showCode}
                />
              </FormGroup>

              <footer className={classes.actions}>
                {!showCode && (
                  <div>
                    {!isLoading ? (
                      <Button
                        type="submit"
                        onClick={EmailForgetPassHandler}
                        disabled={resetEmail.trim().length === 0}
                      >
                        Continue
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
                  </div>
                )}
              </footer>
              {showCode && (
                <div>
                  <h6>
                    An Email with verfication code has
                    been sent to the email address. Please enter the code here
                  </h6>
                  <div className={classes.code}>
                    <ReactCodeInput
                      type="text"
                      fields={6}
                      onChange={(event) => {
                        setCode(event);
                      }}
                    />
                  </div>
                  <footer className={classes.actions}>
                    {!isLoading ? (
                      <Button type="submit" onClick={verificationHandler}>
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
              )}
            </Form>
          </div>
        </Card>
      )}
      {showForgotPaswwordModal && showPasswordReset && (
        <Card className={classes.modal}>
          <header className={classes.header}>
            <h2 style={{ fontWeight: "700" }}>Reset</h2>
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
                <Label for="examplePassword" style={{ fontWeight: "600" }}>
                  Enter new password:{" "}
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
                  id="examplePassword"
                  placeholder="Password"
                  onChange={(event) => {
                    setpasswordError("");
                    setResetPassword(event.target.value);
                    console.log(event.target.value);
                  }}
                />
              </FormGroup >
              <p
                style={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "#e75653",
                  marginTop: "5px",
                  paddingLeft: "5px",
                }}
              >
                {passwordError}
              </p>

              <footer className={classes.actions}>
                {!isLoading ? (
                  <Button
                    type="submit"
                    onClick={PasswordResetHandler}
                    disabled={disableReset}
                  >
                    Reset
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
      )}
    </div>
  );
};

export default LoginModal;
