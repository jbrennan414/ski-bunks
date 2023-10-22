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
  return (
    <ColorButton variant="contained" 
      startIcon={<BedIcon />} 
      onClick={() => props.setSelectedBed(props.bed_id)} 
      disabled={ props.isOccupied } >
      {props.bed_id}
      {props.isOccupied && <Avatar src={props.occupantPhoto} alt="occupant photo"  />}
    </ColorButton>
  );
}