import React, { useState } from 'react'
import { Chip, Avatar } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Menu,
  MenuItem,
} from "@mui/material";

export default function ReservationChip(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const chipStyle = {
    backgroundColor: props.userIsIn ? 'green' : (props.userIsIn === false ? 'red' : 'lightgrey'),
    margin: '5px',
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (value) => {
    props.isIn(value);
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <div key={props.key1}>
      { props.loggedInUser === props.lessor.user_email ? (
        <Chip
          key={props.key1}
          avatar={<Avatar src={props.lessor.user_picture} />}
          label={props.lessor.user_name}
          deleteIcon={<ArrowDropDownIcon />}
          disabled={props.isPastDate}
          onDelete={handleClick}
          style={chipStyle}
        /> ) : (
        <Chip
          key={props.key1}
          avatar={<Avatar src={props.lessor.user_picture} />}
          label={props.lessor.user_name}
          disabled={props.isPastDate}
          style={chipStyle}
        /> )}

      <Menu
        id="status-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuItemClick("in")}>In</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("out")}>Out</MenuItem>
      </Menu>
    </div>

  )
}


