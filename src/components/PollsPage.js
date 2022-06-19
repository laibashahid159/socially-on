import classes1 from "./PollsPage.module.css";
import Card from "./UI/Card";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Container,
} from "reactstrap";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Spinner, Alert } from "reactstrap";
import { Progress } from "reactstrap";

const PollsPage = () => {
  const history = useHistory();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [polls, setPolls] = useState([]);
  const [success, setSuccess] = useState("");
  const [buttonActive, setButtonActive] = useState(true);
  const [visible, setVisible] = useState(true);
  const onDismiss = () => setVisible(false);
  const [visible1, setVisible1] = useState(true);
  const onDismiss1 = () => setVisible1(false);
  const [pollsOption, setPollsOption] = useState();
  const user = localStorage.getItem("user");
  if (user === null) {
    history.push(`/`);
  }
  const [pollsId, setPollsId] = useState();
  const userid = localStorage.getItem("userid");

  const PollsHandler = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://socially-api.ongo.io/api/v1/poll/${userid}`
      );

      const data = await response.json();

      console.log("polls i am here ", data, response);
      if (data.statusCode != 200) {
        throw new Error(data.message);
      }
      setPolls(data.body);
      if (data.body.previouslySelected != 0) {
        setButtonActive(false);
      }
      setPollsId(data.body.id);
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  useEffect(() => {
    PollsHandler();
  }, []);

  // stupid Handler
  const optionHandler = (option_ID) => {
    setPollsOption(option_ID);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const function1 = async () => {
      console.log("user", userid, pollsId, pollsOption);
      setError("");
      try {
        const response = await fetch(
          "https://socially-api.ongo.io/api/v1/polls/addvote",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({
              pollId: pollsId,
              userId: userid,
              optionId: pollsOption,
            }),
          }
        );
        const data = await response.json();
        if (data.statusCode != 200) {
          throw new Error(data.message);
        }
        setSuccess('vote added')
        setTimeout(() => {
          setSuccess("");
        }, 3000);
        setButtonActive(false);
        PollsHandler();
      } catch (error) {
        setError(error.message);
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    };

    if (pollsOption == null) {
      setError("You have to select one option.");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      function1();
    }
  };

  const date1 = new Date(polls.endDate);
  const month = date1.toLocaleString("en-US", { month: "short" });
  const day = date1.toLocaleString("en-US", { day: "2-digit" });
  const year = date1.getFullYear();

  return (
    <div className={classes1.footer}>
      <Container>
      <div className={classes1.modal1}>
          {!error.trim() == 0 && <Alert color="danger" isOpen={visible} toggle={onDismiss}>{error}</Alert>}
          {!success.trim()== 0 && <Alert color="success" isOpen={visible1} toggle={onDismiss1} >'Vote added.'</Alert>}
          </div >
        <Card className={classes1.expenses}>
        {polls.length !== 0 && <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap:'wrap'
            }}
          >
            <h5 className={classes1.totalvotes}>
              {" "}
              Total Votes: {polls.totalVotesOnthisPoll}
            </h5>
           <h5> <b>Poll ends on {month} {day} </b></h5> 
          </div>}
       
          {isLoading && (
            <div style={{display:'flex', justifyContent: "center" }}>
              <Spinner color="secondary" children={null} style={{
                          width: "50px",
                          height: "50px",
                          marginTop: "100px",
                          marginRight: "20px",
                        }} />
            </div>
          )}
           
       {!isLoading && polls.length != 0 && <div> <legend style={{ color: "#555555", marginTop: "20px" , backgroundColor:'#f1f7fa' }}>
            <h4 style={{ fontWeight: "700" }}>{polls.name}</h4>
            <p style={{ fontSize: "18px", wordWrap: "break-word" }}>
              {polls.description}
            </p>
           
          </legend> 
          <Form
            onSubmit={submitHandler}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <FormGroup tag="fieldset">
              {polls.length !== 0 &&
                polls.pollOptions.map((option_ID) => (
                  <>
                    <FormGroup check style={{ marginTop: "10px" }}>
                      <Label
                        check
                        style={{ color: "#555555" }}
                      >
                        <Input
                          type="radio"
                          name="radio1"
                          onClick={() => optionHandler(option_ID.id)}
                          disabled={!buttonActive}
                          {...(polls.previouslySelected && {
                            checked: polls.previouslySelected === option_ID.id,
                          })}
                        />{" "}
                        {option_ID.description}
                      </Label>
                    </FormGroup>
                    <Progress
                      {...( ((option_ID.totalVotesOnthisOption / polls.totalVotesOnthisPoll).toFixed(1) *
                          100)<=50 && {color:'danger'})}
                          {...( ((option_ID.totalVotesOnthisOption / polls.totalVotesOnthisPoll).toFixed(1) *
                            100)>50 && ((option_ID.totalVotesOnthisOption / polls.totalVotesOnthisPoll).toFixed(2) *
                            100)<=80 && {color:'warning'})}
                          {...( (option_ID.totalVotesOnthisOption / polls.totalVotesOnthisPoll).toFixed(1) *
                            100>=80 && {color:'success'})}  
                      value=  { polls.totalVotesOnthisPoll!==0 ?
                        (option_ID.totalVotesOnthisOption / polls.totalVotesOnthisPoll).toFixed(1) *
                        100 : 0
                      }
                    >
                      { polls.totalVotesOnthisPoll!==0 ?
                        (option_ID.totalVotesOnthisOption / polls.totalVotesOnthisPoll).toFixed(1) *
                        100 : 0
                      }%
                    </Progress>{" "}
                    <b>{option_ID.totalVotesOnthisOption} Vote(s) </b>
                  </>
                ))}
            </FormGroup>
            {polls.length != 0 && (
              <button
                type="submit"
                className={classes1.button2}
                disabled={!buttonActive}
              >
                {buttonActive ? <> Submit your vote </> :<> Already voted</>}
               
              </button>
            )}
          </Form></div>}
          {!isLoading && polls.length == 0 &&   <h2 className={classes1.message}> Currently there is no poll active.</h2>}
        </Card>
      </Container>
    </div>
  );
};

export default PollsPage;
