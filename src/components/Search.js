import Card from "./UI/Card";
import classes from "./Landingpage.module.css";
const SearchBar = (props) => {
 const changeHandler=(event)=>{
   props.onChanging(event.target.value);
 }
   
  return (
    <div className={classes.search}>
        {/* <label htmlFor="header-search">
          <span className="visually-hidden">Search Event Name</span>
        </label> */}
        <input
          type="text"
          id="header-search"
          placeholder="Search By Event Name"
          name="s"
          className={classes.searchspace}
          onChange={changeHandler}
        />
    </div>
  );
};

export default SearchBar;
