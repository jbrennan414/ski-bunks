import React from 'react'
import Avatar from '@mui/material/Avatar';
import BedIcon from '@mui/icons-material/Bed';
import './Bed.css';


export default function Bed(props) {

  const translationObject = {
    king1_1: { 
      common_name: "King Bed 1",
      icon: <BedIcon />,
    },
    king1_2: { 
      common_name: "King Bed 2",
      icon: <BedIcon />,
    },
    queen1_1: { 
      common_name: "Queen Bed 1",
      icon: <BedIcon />,
    },
    queen1_2: { 
      common_name: "Queen Bed 2",
      icon: <BedIcon />,
    },
    queen2_1: { 
      common_name: "Queen Bed 3",
      icon: <BedIcon />,
    },
    queen2_2: { 
      common_name: "Queen Bed 4",
      icon: <BedIcon />,
    },
    bunk_1: { 
      common_name: "Bunk Bed 1",
      icon: <BedIcon />,
    },
    bunk_2: { 
      common_name: "Bunk Bed 2",
      icon: <BedIcon />,
    },
    couch: { 
      common_name: "Couch",
      icon: <BedIcon />,
    },

    }

  return (
    <div>
        <button onClick={() => props.setSelectedBed(props.bed_id)} disabled={ false }>
            {props.isOccupied && <Avatar
              alt="occupant_photo"
              src={props.occupantPhoto}
              sx={{ width: 24, height: 24 }}
            /> }
            <BedIcon />
        </button>
        {translationObject[props.bed_id].common_name}

    </div>
  )
}
