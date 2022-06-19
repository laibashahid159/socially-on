import classes from "./LoginModal.module.css";
import Card from "./Card";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";

const LogoutModal = (props) => {
  const history = useHistory();

  const cancelHandler = () => {
    props.onCancel();
  };

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userid");
    localStorage.removeItem("email");
    localStorage.removeItem("admin");
    props.onSet();
    history.push(`/`);
  };

  return (
    <div>
      <div className={classes.backdrop} />

      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2 style={{ fontWeight: "700" }}>Logout</h2>
          <Button
            style={{ borderRadius: "40px", padding: "3px 10px" }}
            onClick={cancelHandler}
          >
            x
          </Button>
        </header>
        <div className={classes.content}>
          Are you sure you want to log out?
          <footer className={classes.actions}>
            <Button type="submit" onClick={logoutHandler}>
              Logout
            </Button>
          </footer>
        </div>
      </Card>
    </div>
  );
};

export default LogoutModal;
