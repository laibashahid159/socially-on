import classes from "./Landingpage.module.css";
import Landingimage from "./landingpage.png";
import { Row, Col, Container } from "reactstrap";
import { useHistory } from "react-router";

//Landing Page code starts here
const LandingPage = () => {
  const history = useHistory();

  const user = localStorage.getItem("user");
  if (user != null) {
    history.push(`/events`);
    console.log("i was here ");
  }

  return (
    <div className={classes.footer}>
      <div className={classes.background} style={{display:'flex'}}>
        <Container  style={{ alignSelf:'center'}} >
          <Row className="d-flex" >
            <Col
              sm="12"
              lg="6"
              xl="6"
              className="d-flex align-items-center "
              style={{justifyContent:'center'}}
            >
              <div>
                <h1> Socially:ON </h1>
                <h2>Meet - Share - Enjoy</h2>
              </div>
            </Col>
            <Col
              sm="12"
              lg="6"
              xl="6"
              className="d-flex align-items-center "
              style={{justifyContent:'center'}}
            >
              <img src={Landingimage} alt="landing" className={classes.image} />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LandingPage;
