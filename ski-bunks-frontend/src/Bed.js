import './Bed.css';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import BedIcon from '@mui/icons-material/Bed';
import { Avatar, Button } from '@mui/material';

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  height: '100px',
  width : '100px',
  padding: '10px',  
  margin: '10px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));

export default function Bed(props) {

  function isBedFull(bed_id) {

    let bedCapacity;

    switch (bed_id) {
      case 'couch':
        bedCapacity = 1;
        break;
      default: 
        bedCapacity = 2;
        break;
    }

    const occupiedSpots = Object.keys(props.occupiedBeds).filter((bed) => bed.includes(props.bed_id));
    const remainingSpots = bedCapacity - occupiedSpots.length;
    return remainingSpots === 0;
  }

  function renderOccupantPhoto() {

    let photos = [];

    const occupiedSpots = Object.keys(props.occupiedBeds).filter((bed) => bed.includes(props.bed_id));

    occupiedSpots.forEach(spot => { 
      photos.push(<Avatar src={props.occupiedBeds[spot].user_picture} alt="occupant photo" />)
    })

    return photos

  }

  return (
    <ColorButton variant="contained" 
      startIcon={<BedIcon />} 
      onClick={() => props.setSelectedBed(props.bed_id)} 
      disabled={ isBedFull(props.bed_id) } >
      {props.bed_id}
      {props.isOccupied && renderOccupantPhoto()}
    </ColorButton>
  );
}