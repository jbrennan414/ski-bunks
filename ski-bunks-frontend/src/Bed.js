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

  const { name, capacity, occupantPhotos} = props.bed;
  const { bed_id }= props;

  function renderOccupantPhoto() {

    let photos = [];

    occupantPhotos.forEach((photoSrc, i) => { 
      photos.push(<Avatar key={i} src={photoSrc} alt="occupant photo" />)
    })

    return photos

  }

  return (
    <ColorButton variant="contained" 
      startIcon={<BedIcon />} 
      onClick={() => props.setSelectedBed(bed_id)} 
      disabled={ capacity === occupantPhotos.length } 
      key={bed_id}
    >
      {name}
    <div className="photo-container">
      {renderOccupantPhoto()}
    </div>
    </ColorButton>
  );
}