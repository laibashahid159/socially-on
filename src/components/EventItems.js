import Card from "./UI/Card";
import classes from "./EventItems.module.css";
import { useHistory } from "react-router";
import { Fragment } from "react";

const EventItems = (props) => {
  var isPast = false;
  const date1 = new Date(props.date);
  const month = date1.toLocaleString("en-US", { month: "short" });
  const day = date1.toLocaleString("en-US", { day: "2-digit" });
  // const year = date1.getFullYear();

  if (props.title.length > 25) {
    var title = props.title.substr(0, 25) + "..";
  } else {
    var title = props.title;
  }

  if (props.location.length > 25) {
    var location = props.location.substr(0, 25) + "..";
  } else {
    var location = props.location;
  }
  const likeness = props.likeness;
  const history = useHistory();
  if (props.dropvalue == "Past Events") {
    var isPast = true;
  } else {
    var isPast = false;
  }

  if (!isPast) {
    if (likeness <= 50 && likeness >= 0) {
      var colored = "#BC2C0D";
      var starImage = "images/Redstar.png";
    }
    if (likeness < 80 && likeness > 50) {
      var colored = "#EAB72E";
      var starImage = "images/Yellowstar.png";
    }
    if (likeness >= 80) {
      var colored = "#0A9220";
      var starImage = "images/Greenstar.png";
    }
  } else {
    var colored = "#505050";
  }

  const rating = props.rating;

  const ClickHandler = () => {
    history.push(`/event_detail/${props.id}`);
  };

  
  const EventImage = "https://test-s3-newdev.s3.amazonaws.com/" + props.image;
  return (
    <>
      <div className={classes.expenseitem} onClick={ClickHandler}>
        <div style={{ display: "flex", width: "100%" }}>
          <img
            src={EventImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/hehe.svg";
            }}
            alt="Event image"
            style={{
              width: "100%",
              height: "160px",
              display: "block",
              objectFit: "cover",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          />
        </div>
        <div className={classes.description}>
          <div className={classes.date}>
            <div className={classes.date__month}>{month}</div>
            <div className={classes.date__day}>{day}</div>
          </div>
          <div className={classes.expenseitem__description}>
            <h2>{title}</h2>
            <p style={{color: '#666666' , fontSize: '15px'}}>{location}</p>
          </div>
        </div>
        {isPast ? (
        <div
        
          className={classes.expenseitem__price}
          style={{
            color: colored,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
           <img
            src="/images/star.svg"
            alt="location icon"
            style={{ width: "22px", height: "auto" , marginTop:'-1px' }}
          />
         <div style={{marginTop:'4px', marginLeft:'3px'}} > {props.rating}</div>
         
        </div>
      ) : (
        <div
          className={classes.expenseitem__price}
          style={{
            color: "black",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "baseline",
          }}
        >
          {" "}
          <img
            src={starImage}
            alt="hearticon"
            style={{ width: "22px", height: "auto" }}
          />
          {props.likeness}%
        </div>
      )}
      </div>
      
    </>
  );
};
export default EventItems;
