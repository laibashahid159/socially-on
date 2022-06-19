import Events from "./Events";
import { useHistory } from "react-router";
import classes from "./Landingpage.module.css";
import { Container } from "reactstrap";

const UserHomePage = () => {
  const history = useHistory();
  const user = localStorage.getItem("user");
  if (user === null) {
    history.push(`/`);
  }
  return (
    <div className={classes.footer1}>
      <Container>
        <Events />
      </Container>
    </div>
  );
};

export default UserHomePage;
