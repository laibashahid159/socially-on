import EventItems from "./EventItems";
import classes from "./EventItems.module.css";
import SearchBar from "./Search";
import { useEffect, useState, useCallback } from "react";
import { Spinner } from "reactstrap";
import MyDropdownMenu from "./UI/Dropdown";
import MyPagination from "./Pagination";

//Event component starts here
const Events = (props) => {
  const paginationSize = 3;
  const [pageNums,setPageNums] = useState([...Array(paginationSize)].map((page,index) => index+1));
  const [pageNoPast, setPageNoPast]=useState(1);
  const[pageNo, setPageNo]=useState(1);
  const [eventsArray, setEventsArray] = useState([]);
  const [filteredarray, setFilteredArray] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dropValue, setDropValue] = useState("Upcoming Events");
  const [pageData, SetPageData] = useState([]);
  const [message, setMessage] = useState(false);

  const fetchUpcommingHandler = async () => {
   
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://socially-api.ongo.io/api/v1/event/upcoming?pageNo=${pageNo}&count=9&sort=1`
      );
      const data = await response.json();
      
      if (data.statusCode != 200) {
        throw new Error("Something went wrong!");
      }

      const loadedUpcomming = [];
      SetPageData(data.body.pageInfo);
      for (const key in data.body.events) {
        loadedUpcomming.push({
          id: data.body.events[key].id,
          title: data.body.events[key].name,
          likeness: (data.body.events[key].avgLikeness * 100) | 0, //change here
          rating: data.body.events[key].avgRating.toFixed(1),
          location: data.body.events[key].location,
          description: data.body.events[key].description,
          date: data.body.events[key].startDate,
          image: data.body.events[key].imageUrl,
        });
      }
      

      setIsLoading(false);
      setEventsArray(loadedUpcomming);
      setFilteredArray(loadedUpcomming);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      setEventsArray([]);
      setFilteredArray([]);
    }
  };

  const fetchPastHandler = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://socially-api.ongo.io/api/v1/event/past?pageNo=${pageNoPast}&count=9&sort=1`
      );
      const data = await response.json();
      if (data.statusCode != 200) {
        throw new Error("Something went wrong!");
      }
      SetPageData(data.body.pageInfo);
      const loadedpast = [];
      for (const key in data.body.events) {
        loadedpast.push({
          id: data.body.events[key].id,
          title: data.body.events[key].name,
          likeness: (data.body.events[key].avgLikeness | 0) * 100,
          rating: data.body.events[key].avgRating.toFixed(1),
          location: data.body.events[key].location,
          description: data.body.events[key].description,
          date: data.body.events[key].startDate,
          image: data.body.events[key].imageUrl,
        });
      }
      setEventsArray(loadedpast);
      setFilteredArray(loadedpast);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setEventsArray([]);
      setFilteredArray([]);
      setIsLoading(false);
    }
  };
 
  console.log('iran', pageData);
  useEffect(() => {
    if (dropValue == "Upcoming Events") {
      fetchUpcommingHandler();
      setPageNo(1);
      setPageNums([...Array(paginationSize)].map((page,index) => index+1))
     
    } else {
      fetchPastHandler();
      setPageNoPast(1);
      setPageNums([...Array(paginationSize)].map((page,index) => index+1))
    }
  }, [dropValue]);
 
  useEffect(() => {
    fetchUpcommingHandler();
  },[pageNo])

  useEffect(() => {
    if (dropValue != "Upcoming Events"){
      fetchPastHandler();
    }
    
  },[pageNoPast])


  const searchHandler = (title) => {
    const FILTERED = eventsArray.filter((item) => {
      return Object.keys(item).some((key) =>
        item.title.toLowerCase().includes(title.toLowerCase())
      );
    });
    setFilteredArray(FILTERED);
  };

  useEffect(() => {
    if (!filteredarray.length) {
      setMessage(true);
    } else {
      setMessage(false);
    }
  }, [filteredarray]);

  return (
    <>
    <div className={classes.expenses}>
      <div>
        <div className={classes.eventflex}>
          <SearchBar onChanging={searchHandler} />
          <MyDropdownMenu onSetting={setDropValue} />
        </div>
       
     {!isLoading &&   <div className={classes.eventsContainer}>
          {filteredarray.length !== 0 &&
            filteredarray.map((items) => (
              <EventItems
                id={items.id}
                title={items.title}
                likeness={items.likeness}
                description={items.description}
                location={items.location}
                rating={items.rating}
                date={items.date}
                image={items.image}
                dropvalue={dropValue}
              />
            ))}
        </div>}
        {isLoading &&
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Spinner
                  color="secondary"
                  children={null}
                  style={{
                    width: "50px",
                    height: "50px",
                    marginTop: "100px",
                    marginRight: "20px",
                  }}
                />
              </div>}
        {message && !isLoading && (
          <h2 className={classes.message}>
              <p>We are planning something amazing for you :)</p>
          </h2>
        )}
      </div>

   
    </div>
    <div style={{marginBottom:'40px'}}>  
      {!isLoading && (filteredarray.length===eventsArray.length) && (pageData.totalPages!==1) &&  dropValue == "Upcoming Events" && <MyPagination page={pageNo} pageData={pageData} pageNums={pageNums} onSet={setPageNo} onPageNo={setPageNums}/>} 
      {!isLoading &&  (filteredarray.length===eventsArray.length) && (pageData.totalPages!==1) && dropValue != "Upcoming Events" && <MyPagination page={pageNoPast} pageData={pageData} pageNums={pageNums}  onSet={setPageNoPast} onPageNo={setPageNums}/>}
    </div>
    </>
   
  );
};

export default Events;
