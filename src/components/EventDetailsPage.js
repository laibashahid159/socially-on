import { useParams } from "react-router-dom";
import Card from "./UI/Card";
import classes1 from "./EventDetailsPage.module.css";
import { Row, Col, Container, Spinner } from "reactstrap";
import { useState, useCallback, useEffect, Fragment } from "react";
import ReactStars from "react-rating-stars-component";
import moment from "moment";

const ProductDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [theEvent, setTheEvent] = useState(false);
  const [Ratings, setRating] = useState(0);
  const params = useParams();
  const [disableStar, setDisableStar] = useState(true);
  const [like, setLike] = useState(2);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

  const commentHandler = async (event) => {
    event.preventDefault();
    if (comment.length != 0) {
      console.log(comment);
      try {
        const response = await fetch(
          "https://socially-api.ongo.io/api/v1/comment/add",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_id: params.eventID,
              user_id: username,
              comment: comment,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("comment not added");
        }

        setComment("");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const commentSaver = (event) => {
    event.preventDefault();
    setComment(event.target.value);
  };

  const LikeHandler = () => {
    setLike(1);
    console.log("like added");
  };
  const disLikeHandler = () => {
    setLike(0);
  };

  const ratingChanged = async (newRating) => {
    setDisableStar(false);
    setRating(newRating);
    console.log("setDisable", disableStar);
    try {
      const response = await fetch(
        "https://socially-api.ongo.io/api/v1/event/rating/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_id: params.eventID,
            user_id: username,
            rating: newRating,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("This Email Already Exists...");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(async () => {
    if (like !== 2 && moment(date1).add(1, "days").isAfter(current)) {
      console.log("i am running");
      try {
        const response = await fetch(
          "https://socially-api.ongo.io/api/v1/event/likeness/add",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_id: params.eventID,
              user_id: username,
              likeness: like,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("This Email Already Exists...");
        }

        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        setError(error.message);
        console.log("i am running error");
        setIsLoading(false);
      }
    }
  }, [like]);

  const username = localStorage.getItem("userid");

  // comment loader
  const commentLoadHandler = useCallback(async () => {
    console.log("iam in comment loader");
    try {
      const response = await fetch(
        `https://socially-api.ongo.io/api/v1/comment/byEvent/${params.eventID}`
      );
     

      const data = await response.json();
      if (data.statusCode != 200) {
        throw new Error("Something went wrong!");
      }
      const comments = [];

      for (const key in data.body) {
        comments.push({
          id: data.body[key].id,
          user_name: data.body[key].user_name,
          comment: data.body[key].comment,
          month:(new Date(data.body[key].time)).toLocaleString("en-US", { month: "short" }),
          day:(new Date(data.body[key].time)).toLocaleString("en-US", { day: "2-digit" }),
          year:(new Date(data.body[key].time)).getFullYear()
        });
      }

      console.log("the comment array", comments);
      setAllComments(comments);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  //Event Handler

  const eventDetailHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://socially-api.ongo.io/api/v1/event/by/?eventId=${params.eventID}&userId=${username}`
      );
      const data = await response.json();
      if (data.statusCode != 200) {
        throw new Error("Something went wrong!");
      }

      const eventDetails = {
        id: data.body.id,
        title: data.body.name,
        likeness: (data.body.avgLikeness * 100) | 0,
        rating: data.body.avgRating.toFixed(1),
        date: data.body.startDate,
        image: data.body.imageUrl,
        description: data.body.description,
        location: data.body.location,
        hasRated: data.body.rated,
        hasLiked: data.body.liked,
        userLikeness: data.body.likeness,
        userRated: data.body.rating,
        endDate: data.body.endDate,
        tags: data.body.tags,
      };
      if (eventDetails.hasLiked) {
        setLike(eventDetails.userLikeness);
      }
      setTheEvent(eventDetails);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const date1 = new Date(theEvent.date);
  const month = date1.toLocaleString("en-US", { month: "short" });
  const day = date1.toLocaleString("en-US", { day: "2-digit" });
  const year = date1.getFullYear();

  const date2 = new Date(theEvent.endDate);
  const month1 = date2.toLocaleString("en-US", { month: "short" });
  const day1 = date2.toLocaleString("en-US", { day: "2-digit" });
  const year1 = date2.getFullYear();
  const current = new Date();

 


  useEffect(() => {
    eventDetailHandler();
  }, []);

  useEffect(() => {
    commentLoadHandler();
  }, [comment]);

  // Images extension is not being returned by the backend here in theEvent.image key
  const EventImage =
  "https://test-s3-newdev.s3.amazonaws.com/" + theEvent.image;
  

  return (
    <div className={classes1.footer}>
      <Container>
        <Card className={classes1.expenses}>
          {isLoading && (
            <div style={{display:'flex', justifyContent: "center" }}>
              <Spinner color="secondary" children={null} style={{
                          width: "50px",
                          height: "50px",
                          marginTop: "5px",
                          marginRight: "20px",
                        }} />
            </div>
          )}
          {!isLoading && (
            <Container>
              <Row className="d-flex">
                <Col sm="12" lg="6" xl="6" className="justify-content-end">
                  <img
                    src={EventImage}
                    onError={(e)=>{e.target.onerror = null; e.target.src="/images/hehe.svg"}}
                    alt="landing"
                    className={classes1.image}
                  />
                </Col>
                <Col sm="12" lg="6" xl="6" className="justify-content-end">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap:'wrap'
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        flexBasis: "max-content",
                      }}
                    >
                      <div className={classes1.date}>
                        <div className={classes1.date__month}>{month}</div>
                        <div className={classes1.date__day}>{day}</div>
                      </div>
                      <h1 className={classes1.title}>{theEvent.title}</h1>
                     
                    </div>
                    {moment(date1).add(1, "days").isAfter(current) && <Fragment>
                        {/* {!theEvent.hasLiked && ( */}
                        <div style={{ alignItems: "flex-end" }}>
                          {like === 0 && (
                            <div style={{ display: "inline-flex" }}>
                              <img
                                src="/images/heartempty.svg"
                                alt="empty"
                                style={{ width: "40px", height: "auto" ,  marginTop:'18px', cursor:'pointer'}}
                                onClick={LikeHandler}
                              />
                              <img
                                src="/images/dislikefull.svg"
                                alt="full"
                                style={{
                                  width: "40px",
                                  height: "auto",
                                  marginLeft: "5px",
                                  marginTop:'18px',
                                  cursor:'pointer'
                                }}
                                onClick={disLikeHandler}
                              />
                            </div>
                          )}
                          {like === 1 && (
                            <div style={{ display: "inline-flex" }}>
                              <img
                                src="/images/heartfull.svg"
                                alt="full"
                                style={{ width: "40px", height: "auto" ,  marginTop:'18px',cursor:'pointer'}}
                                onClick={LikeHandler}
                              />
                              <img
                                src="/images/dislikeempty.svg"
                                alt="empty"
                                style={{
                                  width: "40px",
                                  height: "auto",
                                  marginLeft: "5px",  marginTop:'18px',cursor:'pointer'
                                }}
                                onClick={disLikeHandler}
                              />
                            </div>
                          )}
                          {like === 2 && (
                            <div style={{ display: "inline-flex" }}>
                              <img
                                src="/images/heartempty.svg"
                                alt="empty"
                                style={{ width: "40px", height: "auto" ,  marginTop:'18px',cursor:'pointer'}}
                                onClick={LikeHandler}
                              />
                              <img
                                src="/images/dislikeempty.svg"
                                alt="empty"
                                style={{
                                  width: "40px",
                                  height: "auto",
                                  marginLeft: "5px",  marginTop:'18px',cursor:'pointer'
                                }}
                                onClick={disLikeHandler}
                              />
                            </div>
                          )}
                        </div>
                     
                      </Fragment>}
                  </div>
                  {!moment(date1).add(1, "days").isAfter(current) && (
                      <div>
                        {" "}
                        <div className={classes1.stars}>
                          {!theEvent.hasRated && disableStar && (
                            <ReactStars
                              count={5}
                              onChange={ratingChanged}
                              size={40}
                              isHalf={true}
                              edit={true}
                              emptyIcon={<i className="far fa-star"></i>}
                              fullIcon={<i className="fa fa-star"></i>}
                              activeColor="#f2e59d"
                            />
                          )}
                          {!theEvent.hasRated && !disableStar && (
                            <ReactStars
                              count={5}
                              size={40}
                              isHalf={true}
                              value={Ratings}
                              edit={false}
                              emptyIcon={<i className="far fa-star"></i>}
                              fullIcon={<i className="fa fa-star"></i>}
                              activeColor="#ffd700"
                            />
                          )}
                          {theEvent.hasRated && (
                            <ReactStars
                              count={5}
                              size={40}
                              isHalf={true}
                              value={theEvent.userRated}
                              edit={false}
                              emptyIcon={<i className="far fa-star"></i>}
                              fullIcon={<i className="fa fa-star"></i>}
                              activeColor="#ffd700"
                            />
                          )}
                        </div>{" "}
                      </div>
                    ) }

                  <div className={classes1.desc}>
                    <div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "baseline",
                          width: "100%",
                        }}
                      >
                        <img
                          src="/images/description.svg"
                          alt="empty"
                          style={{ width: "15px", height: "auto" }}
                        />{" "}
                        <h5>&ensp; Description:&ensp;</h5>
                      </div>

                      <p style={{ marginLeft:'30px'}}>{theEvent.description}</p>
                    </div>
               
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: 'flex-end',
                        width: "100%",
                        flexWrap:'wrap'
                      }}
                    >
                      <div>
                        {" "}
                        <img
                          src="/images/location.svg"
                          alt="empty"
                          style={{ width: "15px", height: "auto" }}
                        />{" "}
                        <h5>&ensp;Location:&ensp;</h5>
                      </div>

                      <p className={classes1.detail}>{theEvent.location}</p>
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: 'flex-end',
                        width: "100%",
                        flexWrap:'wrap'
                      }}
                    >
                      <div>
                        {" "}
                        <img
                          src="/images/tag.svg"
                          alt="empty"
                          style={{ width: "15px", height: "auto" }}
                        />{" "}
                        <h5>&ensp;Tag(s):&ensp;</h5>
                      </div>

                      <p className={classes1.detail}>{theEvent.tags}</p>
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "baseline",
                        width: "100%",
                        flexWrap:'wrap'
                      }}
                    >
                      <div>
                        {" "}
                        <img
                          src="/images/time.svg"
                          alt="empty"
                          style={{ width: "15px", height: "auto" }}
                        />{" "}
                        <h5>&ensp;Duration:&ensp;</h5>
                      </div>

                      <p className={classes1.detail}>({month} {day}, {year}&ensp;-&ensp;{month1} {day1}, {year1})</p>
                    </div>

                    {moment(date1).add(1, "days").isAfter(current) ? (
                      <div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "baseline",
                            width: "100%",
                          }}
                        >
                          {" "}
                          <img
                            src="/images/avglike.svg"
                            alt="empty"
                            style={{ width: "15px", height: "auto" }}
                          />{" "}
                          <h5>&ensp; Average Likeness:&ensp;</h5>
                          <p>{theEvent.likeness}%</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "baseline",
                          }}
                        >
                          {" "}
                          <img
                            src="/images/rating.svg"
                            alt="empty"
                            style={{ width: "15px", height: "auto" }}
                          />
                          <h5>&ensp; Average Rating:&ensp; </h5>
                          <p>{theEvent.rating}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
                <Col sm="12" lg="12" xl="12" className="justify-content-end">
                  {!moment(date1).add(1, "days").isAfter(current) && (
                    <h4 className={classes1.commentTitle}>Comments</h4>
                  )}
                   {!moment(date1).add(1, "days").isAfter(current) && (
                    <form
                      className={classes1.postcomment}
                      style={{
                        display: "inline-block",width: "100%",
                      }}
                      onSubmit={commentHandler}
                    >
                      <input
                        type="text"
                        id="comment"
                        placeholder=" Feedback Comments"
                        style={{
                          outline: "none",
                          border: "none",
                          width: "90%",
                          backgroundColor: "transparent",
                        }}
                        onChange={commentSaver}
                        value={comment}
                      />
                      <img
                      src='/images/plane.svg'
                      className={classes1.postbutton}
                        onClick={commentHandler}
                      />
                    </form>
                  )}
                  {!moment(date1).add(1, "days").isAfter(current) &&
                    allComments.map((items) => (
                        <ul
                          style={{
                            listStyleType: "none",paddingLeft:'0px'
                          }}
                        >
                          <li
                            className={classes1.comment}
                            style={{
                              display: "inline-flex",
                              alignItems: "flex-start",
                              justifyContent:'flex-start',
                             
                            }}
                          >
                            <div><img
                              src="/images/user.svg"
                              alt="empty"
                              style={{
                                width: "25px",
                                height: "auto",
                                marginRight:'5px'
                              }}
                            />
                              </div>
                              <div  style={{
                              display: "inline-flex",
                              flexWrap:'wrap'
                            }}><b>{items.user_name}:&ensp; </b>
                              {items.comment}.</div>
                          </li>
                          <li>  <div className={classes1.datestyle}>{items.month} {items.day}, {items.year}</div></li>
                        </ul>
                      ))}
                 
                </Col>
              </Row>
            </Container>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default ProductDetail;
