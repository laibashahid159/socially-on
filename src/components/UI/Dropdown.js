import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import classes from "./Dropdown.module.css";
const MyDropdownMenu = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropValue, setDropValue] = useState("Upcoming Events");
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const dropdownListOptions = ["Upcoming Events", "Past Events"];

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      onSelect={(event) => console.log("option changed", event.target.value)}
    >
      <DropdownToggle
        caret
        className={classes.dropdown}
      >
        {dropValue}
      </DropdownToggle>
      <DropdownMenu>
        {dropdownListOptions.map((elem) => (
          <DropdownItem
            className={classes.upcoming}
            onClick={(event) => {
              props.onSetting(event.target.textContent);
              setDropValue(event.target.textContent)
            }}
          >
            {elem}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default MyDropdownMenu;
